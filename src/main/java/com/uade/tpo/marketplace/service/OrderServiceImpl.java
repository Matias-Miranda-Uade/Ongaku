package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final CartRepository cartRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderStatusRepository orderStatusRepository,
            CartRepository cartRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public ArrayList<Order> getOrders() {
        return new ArrayList<>(orderRepository.findAll());
    }

    @Override
    public Order getOrderById(int id) {
        return orderRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Order createOrder(String entity) {

        String[] values = entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 2) {
            throw new IllegalArgumentException(
                    "La orden requiere usuario y total");
        }

        int userId = Integer.parseInt(values[0].trim());
        double total = Double.parseDouble(values[1].trim());

        if (userId <= 0 || total <= 0) {
            throw new IllegalArgumentException(
                    "Los datos de la orden son invalidos");
        }

        User user = userRepository
                .findById((long) userId)
                .orElse(null);

        if (user == null) {
            throw new IllegalArgumentException(
                    "El usuario no existe");
        }

        OrderStatus status = orderStatusRepository
                .findById(1L)
                .orElse(null);

        if (status == null) {
            throw new IllegalArgumentException(
                    "No existe el estado de orden 1");
        }

        Order order = new Order();

        order.setUser(user);
        order.setOrderStatus(status);
        order.setOrderDate(
                LocalDate.now().toString());
        order.setTotal(total);

        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(
            int orderId,
            int statusId) {

        Order order = getOrderById(orderId);

        if (order == null ||
                statusId < 1 ||
                statusId > 5) {

            return null;
        }

        OrderStatus currentStatus =
                order.getOrderStatus();

        if (currentStatus != null &&
                currentStatus.getId() == 5L) {

            throw new IllegalStateException(
                    "La orden ya esta cancelada");
        }

        if (currentStatus != null &&
                statusId < currentStatus.getId()
                && statusId != 5) {

            throw new IllegalStateException(
                    "La orden no puede retroceder de estado");
        }

        OrderStatus newStatus = orderStatusRepository
                .findById((long) statusId)
                .orElse(null);

        if (newStatus == null) {
            return null;
        }

        order.setOrderStatus(newStatus);

        return orderRepository.save(order);
    }
    @Override
    public Order createOrderFromCart(int cartId) {
        Cart cart = cartRepository.findById((long) cartId).orElse(null);
        if (cart == null || cart.getUser() == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return null;
        }

        OrderStatus status = orderStatusRepository.findById(1L).orElse(null);
        if (status == null) return null;

        List<Vinyl> items = new ArrayList<>(cart.getItems());
        for (Vinyl vinyl : items) {
            if (vinyl.getStock() <= 0) return null;
        }

        double total = items.stream().mapToDouble(Vinyl::getPrice).sum();
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(status);
        order.setOrderDate(LocalDate.now().toString());
        order.setTotal(total);
        order.setVinyl(items);

        for (Vinyl vinyl : items) vinyl.setStock(vinyl.getStock() - 1);
        Order saved = orderRepository.save(order);
        cart.setItems(new ArrayList<>());
        cartRepository.save(cart);
        return saved;
    }

}