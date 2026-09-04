package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.CartItem;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;
import com.uade.tpo.marketplace.entity.dto.OrderStatusResponse;
import com.uade.tpo.marketplace.entity.dto.VinylPreviewResponse;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderStatusRepository orderStatusRepository,
            CartRepository cartRepository,
            VinylRepository vinylRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.cartRepository = cartRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<OrderResponse> getOrders(String email, boolean administrator) {
        if (administrator) {
            return mapOrders(orderRepository.findAll());
        }
        User user = userRepository.findByEmail(email).orElse(null);
        return user == null ? new ArrayList<>() : mapOrders(orderRepository.findByUserId(user.getId()));
    }

    @Override
    public OrderResponse getOrderById(int id, String email, boolean administrator) {
        Order order = orderRepository.findById((long) id).orElse(null);
        if (order == null) {
            return null;
        }
        if (!administrator && (order.getUser() == null || !order.getUser().getEmail().equals(email))) {
            return null;
        }
        return toResponse(order);
    }

    private ArrayList<OrderResponse> mapOrders(List<Order> orders) {
        ArrayList<OrderResponse> responses = new ArrayList<>();
        orders.forEach(order -> responses.add(toResponse(order)));
        return responses;
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderDate(order.getOrderDate());
        response.setTotal(order.getTotal());
        if (order.getOrderStatus() != null) {
            OrderStatusResponse status = new OrderStatusResponse();
            status.setName(order.getOrderStatus().getName());
            status.setDescription(order.getOrderStatus().getDescription());
            response.setOrderStatus(status);
        }
        List<VinylPreviewResponse> products = new ArrayList<>();
        if (order.getVinyl() != null) {
            order.getVinyl().forEach(vinyl -> {
                VinylPreviewResponse product = new VinylPreviewResponse();
                product.setId(vinyl.getId());
                product.setName(vinyl.getName());
                product.setImage(vinyl.getImage());
                product.setPrice(vinyl.getPrice());
                product.setYear(vinyl.getYear());
                product.setArtistName(vinyl.getArtist() == null ? null : vinyl.getArtist().getName());
                products.add(product);
            });
        }
        response.setProducts(products);
        return response;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(int orderId, int statusId) {
        return updateOrderStatus(orderId, statusId, null, true);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(int orderId, int statusId, String email, boolean administrator) {
        Order order = orderRepository.findByIdForUpdate((long) orderId).orElse(null);
        if (order == null || statusId < 1 || statusId > 5) {
            return null;
        }

        if (!administrator) {
            if (order.getUser() == null || !order.getUser().getEmail().equals(email)
                    || order.getOrderStatus() == null
                    || !Long.valueOf(1L).equals(order.getOrderStatus().getId())
                    || !Long.valueOf(5L).equals((long) statusId)) {
                throw new AccessDeniedException("El usuario solo puede cancelar sus órdenes pendientes");
            }
        }

        OrderStatus currentStatus = order.getOrderStatus();
        if (currentStatus != null && !isValidTransition(currentStatus.getId(), (long) statusId)) {
            throw new IllegalStateException("La transición de estado no es válida");
        }
        OrderStatus newStatus = orderStatusRepository.findById((long) statusId).orElse(null);
        if (newStatus == null) {
            return null;
        }
        order.setOrderStatus(newStatus);
        return orderRepository.save(order);
    }

    private boolean isValidTransition(Long currentStatusId, Long newStatusId) {
        if (currentStatusId == null) {
            return Long.valueOf(1L).equals(newStatusId);
        }
        if (currentStatusId.equals(newStatusId)) {
            return true;
        }
        return (Long.valueOf(1L).equals(currentStatusId)
                && (Long.valueOf(2L).equals(newStatusId) || Long.valueOf(5L).equals(newStatusId)))
                || (Long.valueOf(2L).equals(currentStatusId) && Long.valueOf(3L).equals(newStatusId))
                || (Long.valueOf(3L).equals(currentStatusId) && Long.valueOf(4L).equals(newStatusId));
    }

    @Override
    @Transactional
    public Order createOrderFromCart(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        Cart cart = user == null ? null : cartRepository.findByUserIdForUpdate(user.getId()).orElse(null);
        if (cart == null || cart.getUser() == null) {
            throw new IllegalStateException("El usuario no tiene carrito");
        }
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalStateException("El carrito está vacío");
        }

        OrderStatus status = orderStatusRepository.findById(1L).orElse(null);
        if (status == null) {
            throw new IllegalStateException("No existe el estado inicial de la orden");
        }

        List<CartItem> items = new ArrayList<>(cart.getItems());
        for (CartItem item : items) {
            Vinyl vinyl = vinylRepository.findByIdForUpdate(item.getVinyl().getId()).orElse(null);
            if (vinyl == null) {
                throw new IllegalStateException("Un producto del carrito ya no existe");
            }
            if (item.getQuantity() <= 0 || vinyl.getStock() < item.getQuantity()) {
                throw new IllegalStateException("El stock disponible no alcanza para completar la orden");
            }
            item.setVinyl(vinyl);
        }

        double total = items.stream()
                .mapToDouble(item -> (double) item.getVinyl().getPrice() * item.getQuantity())
                .sum();
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(status);
        order.setOrderDate(LocalDate.now().toString());
        order.setTotal(total);
        order.setVinyl(new ArrayList<>(items.stream().map(CartItem::getVinyl).toList()));

        for (CartItem item : items) {
            Vinyl vinyl = item.getVinyl();
            vinyl.setStock(vinyl.getStock() - item.getQuantity());
        }
        Order saved = orderRepository.save(order);
        cart.setItems(new ArrayList<>());
        cartRepository.save(cart);
        return saved;
    }

}