package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.repository.OrderStatusRepository;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;

<<<<<<< HEAD
    public OrderStatusServiceImpl(
            OrderStatusRepository repository) {

        this.orderStatusRepository = repository;
=======
    public OrderStatusServiceImpl(OrderStatusRepository orderStatusRepository) {
        this.orderStatusRepository = orderStatusRepository;
>>>>>>> origin/main
    }

    @Override
    public ArrayList<OrderStatus> getOrderStatuses() {
<<<<<<< HEAD
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

=======
        return new ArrayList<>(orderStatusRepository.findAll());
    }

    @Override
    public OrderStatus getOrderStatusById(int orderStatusId) {
        return orderStatusRepository.findById((long) orderStatusId).orElse(null);
    }

    @Override
    public OrderStatus createOrderStatus(String entity) {
        if (entity == null || entity.isBlank())
            throw new IllegalArgumentException("El estado debe tener nombre");

        OrderStatus status = new OrderStatus();
        status.setName(entity.trim().toUpperCase());
        status.setDescription(entity.trim());
>>>>>>> origin/main
        return orderStatusRepository.save(status);
    }
}