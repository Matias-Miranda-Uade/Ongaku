package com.uade.tpo.marketplace.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private String userName;
    private OrderStatusResponse orderStatus;
    private List<OrderItemResponse> items;
    private int totalProducts;
    private int totalUnits;
    private double total;
}
