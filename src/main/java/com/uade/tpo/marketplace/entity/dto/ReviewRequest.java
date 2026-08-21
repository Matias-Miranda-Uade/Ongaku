package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private int userId;
    private int vinylId;
    private String comment;
}
