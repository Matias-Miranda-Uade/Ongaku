package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.OrderStatus;
import java.util.ArrayList;

public interface OrderStatusService {
    ArrayList<OrderStatus> getOrderStatuses();
    OrderStatus getOrderStatusById(int orderStatusId);
    OrderStatus createOrderStatus(String entity);
}