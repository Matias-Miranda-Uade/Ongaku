package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

import lombok.Data;

@Data
public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItemResponse> items;
    /** Cantidad de productos distintos. */
    private int totalProducts;
    /** Suma de las cantidades de cada linea. */
    private int totalUnits;
    /** Importe total del carrito. */
    private int total;
    private boolean empty;
}
