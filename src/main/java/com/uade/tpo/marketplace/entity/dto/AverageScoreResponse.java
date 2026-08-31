package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class AverageScoreResponse {
    private Long id;
    private Long vinylId;
    private double averageScore;
}