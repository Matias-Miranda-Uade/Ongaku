package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Payment {
    private int id;
    private int orderId;
    private double amount;
    private String method;
    private String paymentDate;
    private String status;
}