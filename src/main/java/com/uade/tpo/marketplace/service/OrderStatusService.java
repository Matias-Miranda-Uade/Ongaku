package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.dto.OrderStatusRequest;
import java.util.ArrayList;

public interface OrderStatusService {
    ArrayList<OrderStatus> getOrderStatuses();
    OrderStatus getOrderStatusById(int orderStatusId);
    OrderStatus createOrderStatus(OrderStatusRequest request);
}