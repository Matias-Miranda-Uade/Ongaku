package com.uade.tpo.marketplace.repository;

<<<<<<< HEAD
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Order;
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(int userId);

    List<Order> findByOrderStatusId(int orderStatusId);
=======
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
>>>>>>> origin/main
}