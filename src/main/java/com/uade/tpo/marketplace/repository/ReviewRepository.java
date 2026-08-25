package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByVinylId(int vinylId);

    List<Review> findByUserId(int userId);
}