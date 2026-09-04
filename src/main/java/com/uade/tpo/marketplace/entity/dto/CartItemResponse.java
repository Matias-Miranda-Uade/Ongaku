package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class CartItemResponse {
    private VinylPreviewResponse product;
    private int quantity;
    private double subtotal;
}