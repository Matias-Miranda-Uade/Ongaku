package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.OrderResponse;

public interface OrderService {
    ArrayList<OrderResponse> getOrders(String email, boolean administrator);
    OrderResponse getOrderById(int orderId, String email, boolean administrator);
    Order createOrderFromCart(String email);
    Order updateOrderStatus(int orderId, int orderStatusId);
    Order updateOrderStatus(int orderId, int orderStatusId, String email, boolean administrator);
}