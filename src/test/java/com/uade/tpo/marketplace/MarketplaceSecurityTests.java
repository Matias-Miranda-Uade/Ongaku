package com.uade.tpo.marketplace;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uade.tpo.marketplace.controllers.config.JwtService;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.FavoriteRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;
import com.uade.tpo.marketplace.service.CartService;
import com.uade.tpo.marketplace.service.OrderService;

import jakarta.persistence.EntityManager;

@SpringBootTest
@Transactional
class MarketplaceSecurityTests {
    @Autowired WebApplicationContext context;
    @Autowired FilterChainProxy security;
    @Autowired JwtService jwt;
    @Autowired UserRepository users;
    @Autowired VinylRepository vinyls;
    @Autowired CartRepository carts;
    @Autowired OrderRepository orders;
    @Autowired FavoriteRepository favorites;
    @Autowired ReviewRepository reviews;
    @Autowired CartService cartService;
    @Autowired OrderService orderService;
    @Autowired JdbcTemplate jdbc;
    @Autowired EntityManager em;
    @Autowired TransactionTemplate transactions;
    MockMvc mvc;
    User owner, other, admin;
    Vinyl vinyl;
    String ownerToken, otherToken, adminToken;
    final ObjectMapper json = new ObjectMapper();

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).addFilters(security).build();
        transactions.executeWithoutResult(status -> {
            owner = user(Role.USER); other = user(Role.USER); admin = user(Role.ADMIN);
            vinyl = new Vinyl(); vinyl.setName("Test vinyl"); vinyl.setPrice(100); vinyl.setStock(10); vinyl.setYear(2020);
            vinyl = vinyls.saveAndFlush(vinyl);
        });
        ownerToken = "Bearer " + jwt.generateToken(owner);
        otherToken = "Bearer " + jwt.generateToken(other);
        adminToken = "Bearer " + jwt.generateToken(admin);
    }

    User user(Role role) {
        String unique = UUID.randomUUID().toString();
        return users.saveAndFlush(User.builder().email(unique + "@test.local").lastName(unique)
                .firstName("Test").password("unused").role(role).build());
    }

    Cart cart(User user, int quantity) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.addItem(vinyl, quantity);
        return carts.saveAndFlush(cart);
    }

    long dataId(org.springframework.test.web.servlet.MvcResult result) throws Exception {
        return json.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();
    }

    String statusBody(OrderStatusType status) {
        return "{\"status\":\"" + status + "\"}";
    }

    @Test
    void orderStatusCatalogIsSeededOnStartup() throws Exception {
        for (OrderStatusType type : OrderStatusType.values()) {
            mvc.perform(get("/order-statuses/" + type.getId()).header("Authorization", ownerToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.name").value(type.name()));
        }
    }

    @Test
    void adminCanFilterVinylsByEnabledState() throws Exception {
        Vinyl disabled = new Vinyl();
        disabled.setName("Disabled vinyl"); disabled.setEnabled(false); disabled.setStock(0);
        disabled = vinyls.saveAndFlush(disabled);
        Vinyl legacy = new Vinyl();
        legacy.setName("Legacy vinyl"); legacy.setEnabled(null);
        legacy = vinyls.saveAndFlush(legacy);
        String path = "/admin/vinyls/filter";
        mvc.perform(get(path).param("enabled", "false")).andExpect(status().isUnauthorized());
        mvc.perform(get(path).param("enabled", "false").header("Authorization", ownerToken))
                .andExpect(status().isForbidden());
        mvc.perform(get(path).param("enabled", "false").header("Authorization", adminToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(disabled.getId()))
                .andExpect(jsonPath("$.data[0].enabled").value(false));
        mvc.perform(get(path).param("enabled", "true").header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.id == " + vinyl.getId() + ")]").isNotEmpty())
                .andExpect(jsonPath("$.data[?(@.id == " + legacy.getId() + ")].enabled")
                        .value(org.hamcrest.Matchers.contains(true)))
                .andExpect(jsonPath("$.data[?(@.id == " + disabled.getId() + ")]").isEmpty());
        mvc.perform(get(path).header("Authorization", adminToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.id == " + disabled.getId() + ")]").isNotEmpty());
        mvc.perform(get(path).param("enabled", "false").param("inStock", "true")
                .header("Authorization", adminToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
        mvc.perform(get("/vinyls/filter").param("enabled", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.id == " + disabled.getId() + ")]").isEmpty())
                .andExpect(jsonPath("$.data[*].enabled").isEmpty());
    }

    @Test
    void publicListsAndAuthenticatedDetails() throws Exception {
        for (String path : new String[]{"/vinyls", "/vinyls/search", "/vinyls/filter", "/vinyls/search/test",
                "/vinyls/artist/1", "/vinyls/genre/1", "/vinyls/category/1", "/vinyls/year/2020",
                "/vinyls/year/asc", "/vinyls/year/desc", "/vinyls/price/asc", "/vinyls/price/desc",
                "/artists", "/genres", "/reviews", "/reviews/vinyl/" + vinyl.getId(), "/categories",
                "/audio-previews", "/average-scores"}) {
            mvc.perform(get(path)).andExpect(status().isOk());
        }
        for (String path : new String[]{"/vinyls/" + vinyl.getId(), "/artists/1", "/genres/1", "/genres/1/vinyls",
                "/reviews/me"}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
        }
        mvc.perform(get("/vinyls/" + vinyl.getId()).header("Authorization", ownerToken)).andExpect(status().isOk());
        mvc.perform(get("/vinyls/" + vinyl.getId()).header("Authorization", adminToken)).andExpect(status().isOk());
    }

    @Test
    void administrationAndWritesRequireCorrectRole() throws Exception {
        for (String path : new String[]{"/dashboard", "/admin/vinyls", "/admin/vinyls/" + vinyl.getId()}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
            mvc.perform(get(path).header("Authorization", ownerToken)).andExpect(status().isForbidden());
            mvc.perform(get(path).header("Authorization", adminToken)).andExpect(status().isOk());
        }
        for (String path : new String[]{"/artists", "/genres", "/categories", "/audio-previews", "/admin/vinyls"}) {
            mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isUnauthorized());
            mvc.perform(post(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isForbidden());
        }
        mvc.perform(post("/artists").header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test artist\"}")).andExpect(status().isCreated());
        mvc.perform(post("/genres").header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test genre\"}")).andExpect(status().isCreated());
        mvc.perform(patch("/admin/vinyls/" + vinyl.getId() + "/stock").param("quantity", "2")
                .header("Authorization", ownerToken)).andExpect(status().isForbidden());
        mvc.perform(patch("/admin/vinyls/" + vinyl.getId() + "/stock").param("quantity", "2")
                .header("Authorization", adminToken)).andExpect(status().isOk());
        for (String path : new String[]{"/average-scores", "/order-statuses"}) {
            mvc.perform(post(path).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isForbidden());
        }
        mvc.perform(get("/unconfigured").header("Authorization", adminToken)).andExpect(status().isForbidden());
    }

    @Test
    void authenticationValidatesCredentialsAndLogoutRevokesTheToken() throws Exception {
        String email = UUID.randomUUID() + "@test.local";
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"test-password\","
                        + "\"firstName\":\"New\",\"lastName\":\"User\"}"))
                .andExpect(status().isOk());

        mvc.perform(post("/api/v1/auth/authenticate").contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andExpect(status().isBadRequest());
        mvc.perform(post("/api/v1/auth/authenticate").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/v1/auth/authenticate").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/auth/authenticate").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"missing@test.local\",\"password\":\"test-password\"}"))
                .andExpect(status().isUnauthorized());

        String response = mvc.perform(post("/api/v1/auth/authenticate").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\" " + email + " \",\"password\":\"test-password\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        String token = "Bearer " + json.readTree(response).get("access token").asText();
        mvc.perform(get("/users/me").header("Authorization", token)).andExpect(status().isOk());
        mvc.perform(post("/api/v1/auth/logout")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/auth/logout").header("Authorization", "Bearer "))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/auth/logout").header("Authorization", token))
                .andExpect(status().isNoContent());
        mvc.perform(get("/users/me").header("Authorization", token)).andExpect(status().isUnauthorized());
    }

    @Test
    void registrationCreatesAnEmptyCartForARegularUser() throws Exception {
        String email = UUID.randomUUID() + "@test.local";
        String body = "{\"email\":\"" + email + "\",\"password\":\"test-password\",\"firstName\":\"New\","
                + "\"lastName\":\"" + email + "\"}";
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());

        User created = users.findByEmail(email).orElseThrow();
        assertThat(created.getRole()).isEqualTo(Role.USER);
        assertThat(carts.findFirstByUser_IdOrderByIdAsc(created.getId())).isPresent();

        mvc.perform(get("/carts").header("Authorization", "Bearer " + jwt.generateToken(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("El carrito está vacío"))
                .andExpect(jsonPath("$.data.userId").value(created.getId()))
                .andExpect(jsonPath("$.data.items.length()").value(0))
                .andExpect(jsonPath("$.data.total").value(0));

        // El mismo email no se puede registrar dos veces.
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
        // Contraseña demasiado corta.
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"x" + email + "\",\"password\":\"short\",\"firstName\":\"New\",\"lastName\":\"X\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registrationHonorsTheRequestedRole() throws Exception {
        String email = UUID.randomUUID() + "@test.local";
        String body = "{\"email\":\"" + email + "\",\"password\":\"test-password\",\"firstName\":\"New\","
                + "\"lastName\":\"" + email + "\",\"role\":\"ADMIN\"}";
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());

        User created = users.findByEmail(email).orElseThrow();
        assertThat(created.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    void privateListsAndItemsAreOnlyVisibleToOwner() throws Exception {
        Cart own = cart(owner, 1); cart(other, 1);
        Favorite favorite = new Favorite(); favorite.setUser(owner); favorite.setVinyl(vinyl); favorites.saveAndFlush(favorite);
        for (String path : new String[]{"/carts", "/carts/" + own.getId(), "/favorites", "/favorites/" + favorite.getId()}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
            mvc.perform(get(path).header("Authorization", adminToken)).andExpect(status().isForbidden());
        }
        mvc.perform(get("/carts").header("Authorization", ownerToken))
                .andExpect(jsonPath("$.data.userId").value(owner.getId()))
                .andExpect(jsonPath("$.data.items.length()").value(1));
        mvc.perform(get("/favorites").header("Authorization", otherToken)).andExpect(jsonPath("$.data.length()").value(0));
        mvc.perform(get("/carts/" + own.getId()).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(delete("/favorites/" + favorite.getId()).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(delete("/favorites/" + favorite.getId()).header("Authorization", ownerToken)).andExpect(status().isNoContent());
        assertThat(favorites.findById(favorite.getId())).isEmpty();
        mvc.perform(post("/favorites").header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":" + owner.getId() + ",\"vinylId\":" + vinyl.getId() + "}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void cartShowsTotalsAndSupportsAddingUpdatingAndRemoving() throws Exception {
        String itemsPath = "/carts/items";
        String itemPath = itemsPath + "/" + vinyl.getId();

        mvc.perform(get("/carts").header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("El carrito está vacío"))
                .andExpect(jsonPath("$.data.empty").value(true));

        mvc.perform(post(itemsPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":2}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].vinylId").value(vinyl.getId()))
                .andExpect(jsonPath("$.data.items[0].name").value("Test vinyl"))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.items[0].unitPrice").value(100))
                .andExpect(jsonPath("$.data.items[0].subtotal").value(200))
                .andExpect(jsonPath("$.data.items[0].available").value(true))
                .andExpect(jsonPath("$.data.totalProducts").value(1))
                .andExpect(jsonPath("$.data.totalUnits").value(2))
                .andExpect(jsonPath("$.data.total").value(200));

        // Volver a agregar el mismo vinilo acumula, no duplica la linea.
        mvc.perform(post(itemsPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":1}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(1))
                .andExpect(jsonPath("$.data.totalUnits").value(3));

        mvc.perform(patch(itemPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":4}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items[0].quantity").value(4))
                .andExpect(jsonPath("$.data.total").value(400));

        for (int quantity : new int[]{0, -1, 11}) {
            int expected = quantity > 10 ? 409 : 400;
            mvc.perform(patch(itemPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"quantity\":" + quantity + "}")).andExpect(status().is(expected));
        }

        mvc.perform(delete(itemPath).header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(0))
                .andExpect(jsonPath("$.data.total").value(0));
        // Ya no esta en el carrito.
        mvc.perform(delete(itemPath).header("Authorization", ownerToken)).andExpect(status().isNotFound());
    }

    @Test
    void cartOperationsRequireACustomerAndOnlyTouchTheOwnCart() throws Exception {
        cart(owner, 2);
        String itemPath = "/carts/items/" + vinyl.getId();
        // El admin no tiene carrito de compras.
        mvc.perform(post("/carts/items").header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":1}")).andExpect(status().isForbidden());
        // El otro usuario opera sobre SU carrito, no sobre el ajeno: el vinilo no esta ahi.
        mvc.perform(patch(itemPath).header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":3}")).andExpect(status().isNotFound());
        mvc.perform(get("/carts").header("Authorization", otherToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(0));
        // Vaciar el carrito.
        mvc.perform(delete("/carts/items").header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.empty").value(true));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void checkoutBuildsTheOrderFromTheCartAndIgnoresClientState() throws Exception {
        Cart cart = transactions.execute(status -> cart(owner, 3));
        mvc.perform(post("/orders").header("Authorization", adminToken)).andExpect(status().isForbidden());

        long id = dataId(mvc.perform(post("/orders").header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"total\":1,\"orderStatusId\":4,\"userId\":" + other.getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.total").value(300))
                .andExpect(jsonPath("$.data.orderStatus.name").value("PENDIENTE"))
                .andExpect(jsonPath("$.data.userId").value(owner.getId()))
                .andExpect(jsonPath("$.data.items[0].name").value("Test vinyl"))
                .andExpect(jsonPath("$.data.items[0].unitPrice").value(100))
                .andExpect(jsonPath("$.data.items[0].quantity").value(3))
                .andExpect(jsonPath("$.data.items[0].subtotal").value(300))
                .andExpect(jsonPath("$.data.totalUnits").value(3))
                .andExpect(jsonPath("$.data.createdAt").isNotEmpty())
                .andReturn());

        transactions.executeWithoutResult(status -> {
            assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(7);
            assertThat(carts.findById(cart.getId()).orElseThrow().getItems()).isEmpty();
            assertThat(orders.findById(id).orElseThrow().getItems().get(0).getQuantity()).isEqualTo(3);
        });

        mvc.perform(get("/orders/" + id).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(get("/orders/" + id).header("Authorization", ownerToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.data.id").value(id));
        mvc.perform(get("/orders/" + id).header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(get("/orders").header("Authorization", otherToken)).andExpect(jsonPath("$.data.length()").value(0));
        mvc.perform(get("/orders").header("Authorization", ownerToken)).andExpect(jsonPath("$.data.length()").value(1));
        // El carrito quedo vacio: no se puede volver a comprar lo mismo.
        mvc.perform(post("/orders").header("Authorization", ownerToken)).andExpect(status().isConflict());
    }

    @Test
    void checkoutWithoutCartReturnsEmptyCartMessage() throws Exception {
        mvc.perform(post("/orders").header("Authorization", ownerToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("El carrito está vacío"));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void failedCheckoutRollsBackAllStockAndKeepsCart() {
        Long cartId = transactions.execute(status -> {
            Cart cart = cart(owner, 2);
            Vinyl second = new Vinyl(); second.setName("Sold out"); second.setPrice(40); second.setStock(0);
            second = vinyls.saveAndFlush(second);
            cart.addItem(second, 1);
            return carts.saveAndFlush(cart).getId();
        });
        assertThatThrownBy(() -> orderService.createOrder(owner.getEmail()))
                .isInstanceOf(InsufficientStockException.class);
        transactions.executeWithoutResult(status -> {
            assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(10);
            assertThat(carts.findById(cartId).orElseThrow().getItems()).hasSize(2);
            assertThat(orders.findByUserId(owner.getId())).isEmpty();
        });
    }

    @Test
    void paymentAndAdminStatusChangesRespectOwnershipAndRoles() throws Exception {
        cart(owner, 2);
        long orderId = orderService.createOrder(owner.getEmail()).getId();
        String payment = "{\"orderId\":" + orderId + ",\"amount\":200,\"method\":\"card\",\"status\":\"RECHAZADO\"}";
        mvc.perform(post("/payments").header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON).content(payment))
                .andExpect(status().isForbidden());
        long paymentId = dataId(mvc.perform(post("/payments").header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON).content(payment)).andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("APROBADO")).andReturn());
        mvc.perform(get("/payments/" + paymentId).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(get("/payments/" + paymentId).header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(get("/payments").header("Authorization", otherToken)).andExpect(jsonPath("$.data.length()").value(0));
        mvc.perform(get("/payments").header("Authorization", ownerToken)).andExpect(jsonPath("$.data.length()").value(1));

        String statusPath = "/orders/" + orderId + "/status";
        // El comprador no puede mover la orden por el flujo logistico.
        for (OrderStatusType target : new OrderStatusType[]{OrderStatusType.ENVIADA, OrderStatusType.ENTREGADA,
                OrderStatusType.CANCELADA}) {
            mvc.perform(patch(statusPath).header("Authorization", ownerToken)
                    .contentType(MediaType.APPLICATION_JSON).content(statusBody(target)))
                    .andExpect(status().isForbidden());
        }
        // Un tercero no puede tocar una orden ajena.
        mvc.perform(patch(statusPath).header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isForbidden());
        // El admin tampoco puede saltearse pasos.
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.ENTREGADA))).andExpect(status().isConflict());
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.ENVIADA))).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderStatus.name").value("ENVIADA"));
        // Tambien se acepta el id del catalogo.
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderStatusId\":4}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderStatus.name").value("ENTREGADA"));
        // Una orden entregada ya no vuelve atras.
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.PENDIENTE))).andExpect(status().isConflict());
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andExpect(status().isBadRequest());
    }

    @Test
    void userCanCancelOwnPendingOrderButNothingElse() throws Exception {
        cart(owner, 3);
        long orderId = orderService.createOrder(owner.getEmail()).getId();
        String statusPath = "/orders/" + orderId + "/status";

        // Pasar a PAGADA es potestad del admin (o del flujo de pago).
        mvc.perform(patch(statusPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.PAGADA))).andExpect(status().isForbidden());
        mvc.perform(patch(statusPath).header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isForbidden());

        mvc.perform(patch(statusPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderStatus.name").value("CANCELADA"));
        mvc.perform(patch(statusPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isConflict());

        em.flush(); em.clear();
        assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(10);
    }

    @Test
    void cancellationRestoresQuantitiesOnlyOnce() throws Exception {
        cart(owner, 3);
        long id = orderService.createOrder(owner.getEmail()).getId();
        String statusPath = "/orders/" + id + "/status";
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isOk());
        mvc.perform(patch(statusPath).header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON)
                .content(statusBody(OrderStatusType.CANCELADA))).andExpect(status().isConflict());
        em.flush(); em.clear();
        assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(10);
    }

    @Test
    void reviewsRequireAPurchaseAndCannotImpersonateAnotherUser() throws Exception {
        cart(owner, 1);
        long orderId = orderService.createOrder(owner.getEmail()).getId();
        String body = "{\"userId\":" + owner.getId() + ",\"vinylId\":" + vinyl.getId() + ",\"comment\":\"Great\",\"score\":5}";

        // Todavia no pago: no puede reseñar.
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isUnprocessableEntity());

        orderService.updateStatus(orderId, OrderStatusType.PAGADA, admin.getEmail());

        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isUnauthorized());
        mvc.perform(post("/reviews").header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/reviews").header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(body.replace("\"score\":5", "\"score\":6"))).andExpect(status().isBadRequest());
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(body.replace("\"comment\":\"Great\"", "\"comment\":\"   \""))).andExpect(status().isBadRequest());

        long reviewId = dataId(mvc.perform(post("/reviews").header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.score").value(5))
                .andExpect(jsonPath("$.data.vinylName").value("Test vinyl"))
                .andExpect(jsonPath("$.data.userId").value(owner.getId()))
                .andExpect(jsonPath("$.data.edited").value(false))
                .andExpect(jsonPath("$.data.createdAt").isNotEmpty()).andReturn());

        // Una sola reseña por producto.
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isConflict());

        Review second = new Review(); second.setUser(other); second.setVinyl(vinyl); second.setScore(3); reviews.saveAndFlush(second);
        Review legacy = new Review(); legacy.setUser(admin); legacy.setVinyl(vinyl); reviews.saveAndFlush(legacy);
        mvc.perform(get("/average-scores/" + vinyl.getId())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.averageScore").value(4));

        // Detalle y listado por producto, publicos.
        mvc.perform(get("/reviews/" + reviewId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.comment").value("Great"));
        mvc.perform(get("/reviews/vinyl/" + vinyl.getId())).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.vinylId").value(vinyl.getId()))
                .andExpect(jsonPath("$.data.totalReviews").value(3))
                .andExpect(jsonPath("$.data.averageScore").value(4))
                .andExpect(jsonPath("$.data.reviews.length()").value(3));
        mvc.perform(get("/reviews").param("vinylId", String.valueOf(vinyl.getId()))).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(3));
        mvc.perform(get("/reviews/me").header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].id").value(reviewId));
        mvc.perform(get("/reviews/99999")).andExpect(status().isNotFound());
    }

    @Test
    void reviewsCanOnlyBeEditedOrDeletedByTheirAuthor() throws Exception {
        cart(owner, 1);
        long orderId = orderService.createOrder(owner.getEmail()).getId();
        orderService.updateStatus(orderId, OrderStatusType.PAGADA, admin.getEmail());
        long reviewId = dataId(mvc.perform(post("/reviews").header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"comment\":\"Great\",\"score\":5}"))
                .andExpect(status().isCreated()).andReturn());
        String path = "/reviews/" + reviewId;

        mvc.perform(patch(path).contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(patch(path).header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"score\":1}")).andExpect(status().isForbidden());
        mvc.perform(patch(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"score\":9}")).andExpect(status().isBadRequest());
        mvc.perform(patch(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andExpect(status().isBadRequest());

        mvc.perform(patch(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"comment\":\"Mejor de lo que esperaba\",\"score\":4}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.comment").value("Mejor de lo que esperaba"))
                .andExpect(jsonPath("$.data.score").value(4))
                .andExpect(jsonPath("$.data.edited").value(true));
        mvc.perform(put(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"comment\":\"Otra vez\",\"score\":3}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.score").value(3));

        mvc.perform(delete(path).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(delete(path).header("Authorization", ownerToken)).andExpect(status().isNoContent());
        assertThat(reviews.findById(reviewId)).isEmpty();

        // Borrada la suya, puede volver a reseñar el mismo producto.
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"comment\":\"Segunda\",\"score\":5}"))
                .andExpect(status().isCreated());
    }

    @Test
    void adminCanModerateButNotWriteReviews() throws Exception {
        cart(owner, 1);
        long orderId = orderService.createOrder(owner.getEmail()).getId();
        orderService.updateStatus(orderId, OrderStatusType.PAGADA, admin.getEmail());
        long reviewId = dataId(mvc.perform(post("/reviews").header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"comment\":\"Great\",\"score\":5}"))
                .andExpect(status().isCreated()).andReturn());
        mvc.perform(patch("/reviews/" + reviewId).header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}")).andExpect(status().isForbidden());
        mvc.perform(delete("/reviews/" + reviewId).header("Authorization", adminToken)).andExpect(status().isNoContent());
    }

    @Test
    void adminCanEditAndDeleteArtistsAndGenresWhileUserCannot() throws Exception {
        long artistId = dataId(mvc.perform(post("/artists").header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Editable artist\"}"))
                .andExpect(status().isCreated()).andReturn());
        long genreId = dataId(mvc.perform(post("/genres").header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Editable genre\"}"))
                .andExpect(status().isCreated()).andReturn());
        mvc.perform(get("/artists/" + artistId).header("Authorization", ownerToken)).andExpect(status().isOk());
        mvc.perform(get("/genres/" + genreId).header("Authorization", ownerToken)).andExpect(status().isOk());
        mvc.perform(put("/artists/" + artistId).header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Changed\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(put("/artists/" + artistId).header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Changed\"}"))
                .andExpect(status().isOk());
        mvc.perform(patch("/genres/" + genreId).header("Authorization", ownerToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Changed\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(patch("/genres/" + genreId).header("Authorization", adminToken)
                .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Changed\"}"))
                .andExpect(status().isOk());
        for (String path : new String[]{"/artists/" + artistId, "/genres/" + genreId}) {
            mvc.perform(delete(path).header("Authorization", ownerToken)).andExpect(status().isForbidden());
            mvc.perform(delete(path).header("Authorization", adminToken)).andExpect(status().is2xxSuccessful());
        }
    }

    @Test
    void soldOutVinylRemainsInCatalogButCannotBePurchased() throws Exception {
        vinyl.setStock(0); vinyls.saveAndFlush(vinyl);
        mvc.perform(get("/vinyls")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.id == " + vinyl.getId() + ")]").isNotEmpty());
        mvc.perform(get("/vinyls/" + vinyl.getId()).header("Authorization", ownerToken)).andExpect(status().isOk());
        mvc.perform(post("/carts/items").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":1}"))
                .andExpect(status().isConflict());
    }

    @Test
    void aSoldVinylCannotBeDeletedButAnUnsoldOneCan() throws Exception {
        Vinyl spare = new Vinyl();
        spare.setName("Nunca vendido"); spare.setPrice(50); spare.setStock(5);
        spare = vinyls.saveAndFlush(spare);
        // Esta en el carrito de alguien, pero nunca se vendio: se puede borrar.
        cartService.addItem(owner.getEmail(), spare.getId(), 1);
        mvc.perform(delete("/admin/vinyls/" + spare.getId()).header("Authorization", adminToken))
                .andExpect(status().is2xxSuccessful());
        assertThat(vinyls.findById(spare.getId())).isEmpty();
        mvc.perform(get("/carts").header("Authorization", ownerToken))
                .andExpect(jsonPath("$.data.items.length()").value(0));

        // El vinilo comprado conserva el historial: no se borra, se deshabilita.
        cartService.addItem(owner.getEmail(), vinyl.getId(), 1);
        orderService.createOrder(owner.getEmail());
        mvc.perform(delete("/admin/vinyls/" + vinyl.getId()).header("Authorization", adminToken))
                .andExpect(status().isConflict());
        assertThat(vinyls.findById(vinyl.getId())).isPresent();
    }

    @Test
    void ownProfileAndInvalidJwt() throws Exception {
        mvc.perform(get("/users/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/users/me").header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(owner.getId()));
        mvc.perform(get("/users/me").header("Authorization", "Bearer invalid")).andExpect(status().isUnauthorized());
        mvc.perform(get("/dashboard").header("Authorization", "Basic invalid")).andExpect(status().isUnauthorized());
    }
}
