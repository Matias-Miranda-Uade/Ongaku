package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.OrderStatus;
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {

    List<OrderStatus> findByName(String name);
}