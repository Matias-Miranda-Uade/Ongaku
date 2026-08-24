package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.AverageScore;

@Repository
public interface AverageScoreRepository extends JpaRepository<AverageScore, Long> {

    List<AverageScore> findByVinylId(int vinylId);
}