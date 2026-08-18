package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;

public class OrderStatusService {

    public ArrayList<OrderStatus> getOrderStatuses() {
        OrderStatusRepository orderStatusRepository = new OrderStatusRepository();
        return orderStatusRepository.getOrderStatuses();
    }

    public OrderStatus getOrderStatusById(int orderStatusId) {
        OrderStatusRepository orderStatusRepository = new OrderStatusRepository();
        return orderStatusRepository.getOrderStatusById(orderStatusId);
    }

    public OrderStatus createOrderStatus(String entity) {
        OrderStatusRepository orderStatusRepository = new OrderStatusRepository();
        return orderStatusRepository.createOrderStatus(entity);
    }
}