package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.OrderRequest;
import java.util.ArrayList;

public interface OrderService {
    ArrayList<Order> getOrders();
    Order getOrderById(int orderId, String requesterEmail);
    Order createOrder(OrderRequest request, String requesterEmail);
    Order createOrderFromCart(int cartId, String requesterEmail);
    Order updateOrderStatus(int orderId, int orderStatusId);
}