package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
public class AverageScoreResponse {
    private Long id;
    private Long vinylId;
    private double averageScore;
}