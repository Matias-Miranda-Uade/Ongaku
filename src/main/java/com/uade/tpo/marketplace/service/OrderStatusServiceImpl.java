package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.OrderStatus;
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
            orderStatusRepository.findAllById(java.util.List.of(1L, 2L, 3L, 4L, 5L))
        );
    }

    @Override
    public OrderStatus getOrderStatusById(int id) {
        if (id < 1 || id > 5) throw new ResourceNotFoundException("Estado de orden", id);
        return orderStatusRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de orden", id));
    }

}
