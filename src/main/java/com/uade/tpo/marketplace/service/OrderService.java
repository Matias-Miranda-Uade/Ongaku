package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Order;
import java.util.ArrayList;

public interface OrderService {
    ArrayList<Order> getOrders();
    Order getOrderById(int orderId);
    Order createOrder(String entity);
    Order updateOrderStatus(int orderId, int orderStatusId);
}