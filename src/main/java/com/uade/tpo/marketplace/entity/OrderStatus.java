package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderStatus {
    private int id;
    private String name;
    private String description;
}