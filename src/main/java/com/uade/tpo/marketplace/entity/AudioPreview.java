package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AudioPreview {
    private int id;
    private String url; 
    private int durationSeconds;
}