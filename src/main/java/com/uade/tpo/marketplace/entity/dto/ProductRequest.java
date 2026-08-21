package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private double price;
    private int stock;
    private Long categoryId;
    private Long artistId;
    private Long audioPreviewId;
}
