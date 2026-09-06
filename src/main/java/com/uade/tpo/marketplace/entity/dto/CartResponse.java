package com.uade.tpo.marketplace.entity.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class CartResponse {
    private Long id;
    private Long userId;
    private List<VinylPreviewResponse> items;
    private Map<Long, Integer> quantities;
}