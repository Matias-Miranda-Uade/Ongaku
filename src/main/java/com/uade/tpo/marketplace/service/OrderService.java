package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.repository.OrderRepository;

public class OrderService {

    public ArrayList<Order> getOrders() {
        OrderRepository orderRepository = new OrderRepository();
        return orderRepository.getOrders();
    }

    public Order getOrderById(int orderId) {
        OrderRepository orderRepository = new OrderRepository();
        return orderRepository.getOrderById(orderId);
    }

    public Order createOrder(String entity) {
        OrderRepository orderRepository = new OrderRepository();
        return orderRepository.createOrder(entity);
    }

    public Order updateOrderStatus(int orderId, int orderStatusId) {
        OrderRepository orderRepository = new OrderRepository();
        return orderRepository.updateOrderStatus(orderId, orderStatusId);
    }
}