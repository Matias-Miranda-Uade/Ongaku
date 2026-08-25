package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;

    public OrderStatusServiceImpl(
            OrderStatusRepository repository) {

        this.orderStatusRepository = repository;
    }

    @Override
    public ArrayList<OrderStatus> getOrderStatuses() {
        return new ArrayList<>(
            orderStatusRepository.findAll()
        );
    }

    @Override
    public OrderStatus getOrderStatusById(int id) {
        return orderStatusRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public OrderStatus createOrderStatus(
            String entity) {

        if (entity == null ||
            entity.isBlank()) {

            throw new IllegalArgumentException(
                "El estado debe tener nombre"
            );
        }

        OrderStatus status = new OrderStatus();

        status.setName(
            entity.trim().toUpperCase()
        );

        status.setDescription(
            entity.trim()
        );

        return orderStatusRepository.save(status);
    }
}