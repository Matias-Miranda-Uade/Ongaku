package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Order;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {
    public ArrayList<Order> orders = new ArrayList<>(Arrays.asList(
            Order.builder().id(1).userId(1).orderStatusId(2).orderDate("2026-08-10").total(15000.0).build(),
            Order.builder().id(2).userId(2).orderStatusId(1).orderDate("2026-08-14").total(8500.0).build(),
            Order.builder().id(3).userId(3).orderStatusId(3).orderDate("2026-08-15").total(23000.0).build(),
            Order.builder().id(4).userId(1).orderStatusId(4).orderDate("2026-08-16").total(12000.0).build(),
            Order.builder().id(5).userId(4).orderStatusId(5).orderDate("2026-08-17").total(6000.0).build()
    ));

    public ArrayList<Order> getOrders() {
        return this.orders;
    }

    public Order getOrderById(int orderId) {
        return null;
    }

    public Order createOrder(String entity) {
        return null;
    }

    public Order updateOrderStatus(int orderId, int orderStatusId) {
        return null;
    }
}