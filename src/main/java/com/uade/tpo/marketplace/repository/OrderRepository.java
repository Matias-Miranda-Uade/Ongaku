package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Order;
import org.springframework.data.jpa.repository.Query;
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.userId = :userId")
    List<Order> findByUserId(int userId);

    @Query("SELECT o FROM Order o WHERE o.orderStatusId = :orderStatusId")
    List<Order> findByOrderStatusId(int orderStatusId);
}