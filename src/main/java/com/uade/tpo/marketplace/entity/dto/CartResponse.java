package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

import lombok.Data;

@Data
public class CartResponse {
    private List<CartItemResponse> items;
    private double total;
    private String message;
}