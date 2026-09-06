package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.entity.dto.AverageScoreRequest;
import java.util.ArrayList;

public interface AverageScoreService {
    ArrayList<AverageScore> getAverageScores();
    AverageScore getAverageScoreById(int averageScoreId);
    AverageScore createAverageScore(AverageScoreRequest request);
}