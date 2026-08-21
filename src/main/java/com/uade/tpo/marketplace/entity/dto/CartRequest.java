package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class CartRequest {
    private int userId;
    private int vinylId;
    private int quantity;
}
