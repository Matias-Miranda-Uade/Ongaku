package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.AverageScore;
import com.uade.tpo.marketplace.entity.dto.AverageScoreResponse;

public final class AverageScoreMapper {
    private AverageScoreMapper() {
    }

    public static AverageScoreResponse toResponse(AverageScore score) {
        if (score == null) return null;
        AverageScoreResponse response = new AverageScoreResponse();
        response.setId(score.getId());
        response.setVinylId(score.getVinyl() != null ? score.getVinyl().getId() : null);
        response.setAverageScore(score.getAverageScore());
        return response;
    }
}
