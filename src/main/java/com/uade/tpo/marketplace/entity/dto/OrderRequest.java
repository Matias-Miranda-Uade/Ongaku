package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private int userId;
    private int orderStatusId;
    private String orderDate;
    private double total;
}
