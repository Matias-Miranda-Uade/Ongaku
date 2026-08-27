package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.marketplace.entity.Cart;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c WHERE c.userId = :userId")
    List<Cart> findByUserId(int userId);

    @Query("SELECT c FROM Cart c WHERE c.userId = :userId AND c.vinylId = :vinylId")
    List<Cart> findByUserIdAndVinylId(int userId, int vinylId);
}