package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Order;
import java.util.ArrayList;

public interface OrderService {
    ArrayList<Order> getOrders(String requesterEmail);
    Order getOrderById(int orderId, String requesterEmail);
    Order createOrderFromCart(int cartId, String requesterEmail);
    Order createOrderFromCurrentUserCart(String requesterEmail);
    Order updateOrderStatus(int orderId, int orderStatusId);
}