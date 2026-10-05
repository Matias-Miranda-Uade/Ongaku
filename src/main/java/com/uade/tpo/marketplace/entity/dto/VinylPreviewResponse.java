package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class VinylPreviewResponse {
    private Long id;
    private String name;
    private String image;
    private int price;
    private int originalPrice;
    private int discountPercentage;
    private int discountAmount;
    private int finalPrice;
    private int year;
    private String artistName;
    private String categoryDescription;
}
