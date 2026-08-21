package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class AudioPreviewRequest {
    private String url;
    private int durationSeconds;
}
