package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class AudioPreviewResponse {
    private Long id;
    private String url;
    private int durationSeconds;
}