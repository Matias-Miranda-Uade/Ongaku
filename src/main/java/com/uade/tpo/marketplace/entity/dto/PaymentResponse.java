package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private double amount;
    private String method;
    private String paymentDate;
    private String status;
}