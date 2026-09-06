package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;
import java.util.List;

public interface AverageScoreService {
    List<AverageScoreResponse> getAverageScores();
    AverageScoreResponse getAverageScoreById(int vinylId);
}
