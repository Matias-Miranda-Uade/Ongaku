package com.uade.tpo.marketplace.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public ArrayList<Order> getOrders() {
        return new ArrayList<>(orderRepository.findAll());
    }

    @Override
    public Order getOrderById(int orderId) {
        return orderRepository.findById((long) orderId).orElse(null);
    }

    @Override
    public Order createOrder(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 2)
            throw new IllegalArgumentException("La orden requiere usuario y total");

        int userId = Integer.parseInt(values[0].trim());
        double total = Double.parseDouble(values[1].trim());
        if (userId <= 0 || total <= 0)
            throw new IllegalArgumentException("Los datos de la orden son invalidos");

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderStatusId(1);
        order.setOrderDate(LocalDate.now().toString());
        order.setTotal(total);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderStatus(int orderId, int orderStatusId) {
        Order order = getOrderById(orderId);
        if (order == null || orderStatusId < 1 || orderStatusId > 5)
            return null;
        if (order.getOrderStatusId() == 5 || (orderStatusId < order.getOrderStatusId() && orderStatusId != 5))
            throw new IllegalStateException("La orden no puede retroceder de estado");

        order.setOrderStatusId(orderStatusId);
        return orderRepository.save(order);
    }
}