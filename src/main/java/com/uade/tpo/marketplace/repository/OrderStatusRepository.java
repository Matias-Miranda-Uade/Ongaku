package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.OrderStatus;
import org.springframework.data.jpa.repository.Query;
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {

    @Query("SELECT o FROM OrderStatus o WHERE o.name = :name")
    List<OrderStatus> findByName(String name);
}