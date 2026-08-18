package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Order {
    private int id;
    private int userId;
    private int orderStatusId;
    private String orderDate;
    private double total;
}