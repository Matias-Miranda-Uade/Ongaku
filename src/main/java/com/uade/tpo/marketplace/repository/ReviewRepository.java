package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.Review;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("select new com.uade.tpo.marketplace.entity.dto.AverageScoreResponse(v.id, v.id, coalesce(avg(r.score), 0.0)) " +
            "from Vinyl v left join v.reviews r group by v.id")
    List<com.uade.tpo.marketplace.entity.dto.AverageScoreResponse> calculateAverageScores();

    @Query("select new com.uade.tpo.marketplace.entity.dto.AverageScoreResponse(v.id, v.id, coalesce(avg(r.score), 0.0)) " +
            "from Vinyl v left join v.reviews r where v.id = :vinylId group by v.id")
    java.util.Optional<com.uade.tpo.marketplace.entity.dto.AverageScoreResponse> calculateAverageScore(Long vinylId);


    @Query("SELECT r FROM Review r WHERE r.vinyl.id = :vinylId")
    List<Review> findByVinylId(int vinylId);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    List<Review> findByUserId(int userId);
}