package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.repository.AverageScoreRepository;

public class AverageScoreService {
    
    public ArrayList<AverageScore> getAverageScores() {
        AverageScoreRepository averageScoreRepository = new AverageScoreRepository();
        return averageScoreRepository.getAverageScores();
    }

    public AverageScore getAverageScoreById(int averageScoreId) {
        AverageScoreRepository averageScoreRepository = new AverageScoreRepository();
        return averageScoreRepository.getAverageScoreById(averageScoreId);
    }

    public AverageScore createAverageScore(String entity) {
        AverageScoreRepository averageScoreRepository = new AverageScoreRepository();
        return averageScoreRepository.createAverageScore(entity);
    }
}
