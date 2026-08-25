package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Order;
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(int userId);

    List<Order> findByOrderStatusId(int orderStatusId);
}