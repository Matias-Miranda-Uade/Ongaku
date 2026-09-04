package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private Long vinylId;
    private String userName;
    private String comment;
}