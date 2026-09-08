package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private int vinylId;
    private int quantity = 1;
}
