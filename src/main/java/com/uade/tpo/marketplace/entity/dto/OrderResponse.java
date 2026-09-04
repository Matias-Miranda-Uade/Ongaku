package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private String orderDate;
    private double total;
    private OrderStatusResponse orderStatus;
    private List<VinylPreviewResponse> products;
}