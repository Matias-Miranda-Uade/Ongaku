package com.uade.tpo.marketplace.entity.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private String orderDate;
    private double total;
    private Long userId;
    private OrderStatusResponse orderStatus;
    private List<Long> vinylIds;
    private Map<Long, Integer> quantities;
}