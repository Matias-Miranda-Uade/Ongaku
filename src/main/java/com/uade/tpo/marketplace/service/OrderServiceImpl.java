package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderStatusRepository orderStatusRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            OrderStatusRepository orderStatusRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderStatusRepository = orderStatusRepository;
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
}