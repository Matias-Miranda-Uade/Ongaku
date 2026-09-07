package com.uade.tpo.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("select new com.uade.tpo.marketplace.entity.dto.AverageScoreResponse(v.id, v.id, coalesce(avg(r.score), 0.0)) " +
            "from Vinyl v left join v.reviews r group by v.id")
    List<AverageScoreResponse> calculateAverageScores();

    @Query("select new com.uade.tpo.marketplace.entity.dto.AverageScoreResponse(v.id, v.id, coalesce(avg(r.score), 0.0)) " +
            "from Vinyl v left join v.reviews r where v.id = :vinylId group by v.id")
    Optional<AverageScoreResponse> calculateAverageScore(Long vinylId);

    @Query("select r from Review r order by r.id desc")
    List<Review> findAllMostRecentFirst();

    @Query("select r from Review r where r.vinyl.id = :vinylId order by r.id desc")
    List<Review> findByVinylId(Long vinylId);

    @Query("select r from Review r where r.user.id = :userId order by r.id desc")
    List<Review> findByUserId(Long userId);

    @Query("select r from Review r where r.user.id = :userId and r.vinyl.id = :vinylId")
    Optional<Review> findByUserIdAndVinylId(Long userId, Long vinylId);

    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Review r where r.vinyl.id = :vinylId")
    int deleteByVinylId(Long vinylId);
}
