package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.OrderStatus;
import com.uade.tpo.marketplace.entity.dto.OrderStatusRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateResourceException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
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
        return orderStatusRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", id));
    }

    @Override
    public OrderStatus createOrderStatus(OrderStatusRequest request) {

        if (request == null) {
            throw new InvalidRequestException("Los datos del estado de orden son obligatorios");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidFieldException("name", "no puede estar vacio");
        }
        if (!orderStatusRepository.findByName(request.getName().trim().toUpperCase()).isEmpty()) {
            throw new DuplicateResourceException("Estado de orden", request.getName());
        }

        OrderStatus status = new OrderStatus();
        status.setName(request.getName().trim().toUpperCase());
        status.setDescription(request.getDescription() != null ? request.getDescription().trim() : request.getName().trim());

        return orderStatusRepository.save(status);
    }
}