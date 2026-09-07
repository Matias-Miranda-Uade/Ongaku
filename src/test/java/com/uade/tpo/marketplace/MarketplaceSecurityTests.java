package com.uade.tpo.marketplace;

import java.util.ArrayList;
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
            String[] names = {"PENDIENTE", "PAGADA", "ENVIADA", "ENTREGADA", "CANCELADA"};
            for (int i = 0; i < names.length; i++) {
                jdbc.update("MERGE INTO order_status (id, name, description) KEY(id) VALUES (?, ?, ?)", i + 1, names[i], names[i]);
            }
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
        Cart cart = new Cart(); cart.setUser(user); cart.setItems(new ArrayList<>());
        cart.getItems().add(vinyl); cart.getQuantities().put(vinyl.getId(), quantity);
        return carts.saveAndFlush(cart);
    }

    long dataId(org.springframework.test.web.servlet.MvcResult result) throws Exception {
        return json.readTree(result.getResponse().getContentAsString()).path("data").path("id").asLong();
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
                "/artists", "/genres", "/reviews", "/categories", "/audio-previews", "/average-scores"}) {
            mvc.perform(get(path)).andExpect(status().isOk());
        }
        for (String path : new String[]{"/vinyls/" + vinyl.getId(), "/artists/1", "/genres/1", "/genres/1/vinyls"}) {
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
    void registrationCannotChooseAdmin() throws Exception {
        String email = UUID.randomUUID() + "@test.local";
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON).content(
                "{\"email\":\"" + email + "\",\"password\":\"test-password\",\"firstName\":\"New\",\"lastName\":\"" + email + "\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk());
        assertThat(users.findByEmail(email).orElseThrow().getRole()).isEqualTo(Role.USER);
    }

    @Test
    void privateListsAndItemsAreOnlyVisibleToOwner() throws Exception {
        Cart own = cart(owner, 1); cart(other, 1);
        Favorite favorite = new Favorite(); favorite.setUser(owner); favorite.setVinyl(vinyl); favorites.saveAndFlush(favorite);
        for (String path : new String[]{"/carts", "/carts/" + own.getId(), "/favorites", "/favorites/" + favorite.getId()}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
            mvc.perform(get(path).header("Authorization", adminToken)).andExpect(status().isForbidden());
        }
        mvc.perform(get("/carts").header("Authorization", ownerToken)).andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].userId").value(owner.getId()));
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
    void cartSupportsEmptyCreationAddingUpdatingAndRemovingQuantities() throws Exception {
        long id = dataId(mvc.perform(post("/carts").header("Authorization", ownerToken))
                .andExpect(status().isCreated()).andReturn());
        String path = "/carts/" + id + "/items";
        String itemPath = path + "/" + vinyl.getId();
        mvc.perform(post(path).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":2}" )).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.quantities['" + vinyl.getId() + "']").value(2));
        mvc.perform(patch(itemPath).header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":3}")).andExpect(status().isForbidden());
        mvc.perform(patch(itemPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":3}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.quantities['" + vinyl.getId() + "']").value(3));
        for (int quantity : new int[]{0, -1, 11}) {
            int expected = quantity > 10 ? 409 : 400;
            mvc.perform(patch(itemPath).header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"quantity\":" + quantity + "}")).andExpect(status().is(expected));
        }
        mvc.perform(delete(itemPath).header("Authorization", ownerToken)).andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(0));
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void checkoutCalculatesTotalAndIgnoresClientStateAndPrice() throws Exception {
        Cart cart = transactions.execute(status -> cart(owner, 3));
        mvc.perform(post("/orders/cart/" + cart.getId()).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(post("/orders/cart/" + cart.getId()).header("Authorization", adminToken)).andExpect(status().isForbidden());
        long id = dataId(mvc.perform(post("/orders").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"cartId\":" + cart.getId() + ",\"total\":1,\"orderStatusId\":4,\"userId\":" + other.getId() + "}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.total").value(300))
                .andExpect(jsonPath("$.data.orderStatus.id").value(1)).andExpect(jsonPath("$.data.userId").value(owner.getId()))
                .andExpect(jsonPath("$.data.quantities['" + vinyl.getId() + "']").value(3)).andReturn());
        transactions.executeWithoutResult(status -> {
            assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(7);
            assertThat(carts.findById(cart.getId()).orElseThrow().getItems().size()).isZero();
            assertThat(orders.findById(id).orElseThrow().quantityOf(vinyl.getId())).isEqualTo(3);
        });
        mvc.perform(get("/orders/" + id).header("Authorization", otherToken)).andExpect(status().isForbidden());
        mvc.perform(get("/orders/" + id).header("Authorization", ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(id));
        mvc.perform(get("/orders/" + id).header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(get("/orders").header("Authorization", otherToken)).andExpect(jsonPath("$.data.length()").value(0));
        mvc.perform(get("/orders").header("Authorization", ownerToken)).andExpect(jsonPath("$.data.length()").value(1));
        mvc.perform(post("/orders/cart/" + cart.getId()).header("Authorization", ownerToken)).andExpect(status().isConflict());
    }

        @Test
        void emptyCartListReturnsExpectedMessage() throws Exception {
                mvc.perform(get("/carts").header("Authorization", ownerToken))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("El carrito está vacío"))
                                .andExpect(jsonPath("$.data.length()").value(0));
        }

        @Test
        @Transactional(propagation = Propagation.NOT_SUPPORTED)
        void checkoutCanUseTheAuthenticatedUsersCartWithoutAnId() throws Exception {
                transactions.execute(status -> cart(owner, 1));

                mvc.perform(post("/orders/cart").header("Authorization", ownerToken))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.data.userId").value(owner.getId()));
        }

        @Test
        void checkoutWithoutCartReturnsEmptyCartMessage() throws Exception {
                mvc.perform(post("/orders/cart").header("Authorization", ownerToken))
                                .andExpect(status().isConflict())
                                .andExpect(jsonPath("$.message").value("El carrito está vacío"));
        }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void failedCheckoutRollsBackAllStockAndKeepsCart() {
        Long cartId = transactions.execute(status -> {
            Cart cart = cart(owner, 2);
            Vinyl second = new Vinyl(); second.setName("Sold out"); second.setPrice(40); second.setStock(0);
            vinyls.saveAndFlush(second); cart.getItems().add(second);
            return carts.saveAndFlush(cart).getId();
        });
        assertThatThrownBy(() -> orderService.createOrderFromCart(Math.toIntExact(cartId), owner.getEmail()))
                .isInstanceOf(InsufficientStockException.class);
        transactions.executeWithoutResult(status -> {
            assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(10);
            assertThat(carts.findById(cartId).orElseThrow().getItems()).hasSize(2);
            assertThat(orders.findByUserId(Math.toIntExact(owner.getId()))).isEmpty();
        });
    }

    @Test
    void paymentAndStatusChangesRespectOwnershipAndRoles() throws Exception {
        long orderId = orderService.createOrderFromCart(Math.toIntExact(cart(owner, 2).getId()), owner.getEmail()).getId();
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
        mvc.perform(patch("/orders/" + orderId + "/status").param("orderStatusId", "3").header("Authorization", ownerToken))
                .andExpect(status().isForbidden());
        mvc.perform(patch("/orders/" + orderId + "/status/3").header("Authorization", ownerToken)).andExpect(status().isForbidden());
        mvc.perform(put("/orders/" + orderId).param("orderStatusId", "3").header("Authorization", ownerToken)).andExpect(status().isForbidden());
        mvc.perform(patch("/orders/" + orderId + "/status/4").header("Authorization", adminToken)).andExpect(status().isConflict());
        mvc.perform(patch("/orders/" + orderId + "/status/3").header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(put("/orders/" + orderId).param("orderStatusId", "4").header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(patch("/orders/" + orderId + "/status/1").header("Authorization", adminToken)).andExpect(status().isConflict());
    }

    @Test
    void cancellationRestoresQuantitiesOnlyOnce() throws Exception {
        long id = orderService.createOrderFromCart(Math.toIntExact(cart(owner, 3).getId()), owner.getEmail()).getId();
        mvc.perform(patch("/orders/" + id + "/status/5").header("Authorization", adminToken)).andExpect(status().isOk());
        mvc.perform(patch("/orders/" + id + "/status/5").header("Authorization", adminToken)).andExpect(status().isConflict());
        em.flush(); em.clear();
        assertThat(vinyls.findById(vinyl.getId()).orElseThrow().getStock()).isEqualTo(10);
    }

    @Test
    void reviewsProduceAverageAndCannotImpersonateAnotherUser() throws Exception {
        long orderId = orderService.createOrderFromCart(Math.toIntExact(cart(owner, 1).getId()), owner.getEmail()).getId();
        orderService.updateOrderStatus(Math.toIntExact(orderId), 2);
        String body = "{\"userId\":" + owner.getId() + ",\"vinylId\":" + vinyl.getId() + ",\"comment\":\"Great\",\"score\":5}";
        mvc.perform(post("/reviews").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isUnauthorized());
        mvc.perform(post("/reviews").header("Authorization", otherToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/reviews").header("Authorization", adminToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON).content(body.replace("\"score\":5", "\"score\":6")))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.data.score").value(5));
        Review second = new Review(); second.setUser(other); second.setVinyl(vinyl); second.setScore(3); reviews.saveAndFlush(second);
        Review legacy = new Review(); legacy.setUser(admin); legacy.setVinyl(vinyl); reviews.saveAndFlush(legacy);
        mvc.perform(get("/average-scores/" + vinyl.getId())).andExpect(status().isOk()).andExpect(jsonPath("$.data.averageScore").value(4));
        mvc.perform(post("/reviews").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
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
        mvc.perform(post("/carts").header("Authorization", ownerToken).contentType(MediaType.APPLICATION_JSON)
                .content("{\"vinylId\":" + vinyl.getId() + ",\"quantity\":1}"))
                .andExpect(status().isConflict());
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
