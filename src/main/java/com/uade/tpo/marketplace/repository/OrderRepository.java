package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Order;
import org.springframework.data.jpa.repository.Query;
public interface OrderRepository extends JpaRepository<Order, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Order e where e.id = :id")
    java.util.Optional<Order> findForUpdateById(Long id);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId")
    List<Order> findByUserId(int userId);

    @Query("SELECT o FROM Order o WHERE o.orderStatus.id = :orderStatusId")
    List<Order> findByOrderStatusId(int orderStatusId);
}