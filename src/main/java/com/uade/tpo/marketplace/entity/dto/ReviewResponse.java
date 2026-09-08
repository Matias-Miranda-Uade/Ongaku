package com.uade.tpo.marketplace.entity.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private String comment;
    private Integer score;
    private Long userId;
    private String userName;
    private Long vinylId;
    private String vinylName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
}
