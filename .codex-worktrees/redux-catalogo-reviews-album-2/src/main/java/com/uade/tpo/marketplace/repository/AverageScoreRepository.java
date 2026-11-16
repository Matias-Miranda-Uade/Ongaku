package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.AverageScore;
import org.springframework.data.jpa.repository.Query;


public interface AverageScoreRepository extends JpaRepository<AverageScore, Long> {

    @Query("SELECT a FROM AverageScore a WHERE a.vinyl.id = :vinylId")
    List<AverageScore> findByVinylId(int vinylId);
}