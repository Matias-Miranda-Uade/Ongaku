package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {
    private final OrderStatusRepository orderStatusRepository;
    public OrderStatusServiceImpl(OrderStatusRepository repository) { this.orderStatusRepository = repository; }
    public ArrayList<OrderStatus> getOrderStatuses() { return orderStatusRepository.getOrderStatuses(); }
    public OrderStatus getOrderStatusById(int id) { return orderStatusRepository.getOrderStatuses().stream().filter(s -> s.getId() == id).findFirst().orElse(null); }
    public OrderStatus createOrderStatus(String entity) {
        if (entity == null || entity.isBlank()) throw new IllegalArgumentException("El estado debe tener nombre");
        OrderStatus status = OrderStatus.builder().id(orderStatusRepository.getOrderStatuses().stream().mapToLong(OrderStatus::getId).max().orElse(0) + 1).name(entity.trim().toUpperCase()).description(entity.trim()).build();
        orderStatusRepository.getOrderStatuses().add(status); return status;
    }
}