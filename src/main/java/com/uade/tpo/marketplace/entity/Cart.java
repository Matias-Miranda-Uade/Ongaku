package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Cart {
    private int id;
    private int userId;
    private int vinylId;
    private int quantity;
}
