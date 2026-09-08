package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

/** Linea de la orden con los datos congelados al momento de la compra. */
@Data
public class OrderItemResponse {
    private Long vinylId;
    private String name;
    private String artistName;
    private String image;
    private int unitPrice;
    private int quantity;
    private int subtotal;
}
