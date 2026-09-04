package com.uade.tpo.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import com.uade.tpo.marketplace.entity.Order;
import org.springframework.data.jpa.repository.Query;
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END "
            + "FROM Order o JOIN o.vinyl v "
            + "WHERE o.user.id = :userId AND v.id = :vinylId "
            + "AND o.orderStatus.id IN (2, 3, 4)")
    boolean existsCompletedPurchase(Long userId, Long vinylId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Order o WHERE o.id = :orderId")
    java.util.Optional<Order> findByIdForUpdate(Long orderId);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId")
    List<Order> findByUserId(Long userId);

    @Query("SELECT o FROM Order o WHERE o.orderStatus.id = :orderStatusId")
    List<Order> findByOrderStatusId(int orderStatusId);
}