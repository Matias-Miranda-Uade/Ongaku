package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Review;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.vinylId = :vinylId")
    List<Review> findByVinylId(int vinylId);

    @Query("SELECT r FROM Review r WHERE r.userId = :userId")
    List<Review> findByUserId(int userId);
}