package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

/** Linea del carrito tal como la ve el usuario. */
@Data
public class CartItemResponse {
    private Long vinylId;
    private String name;
    private String artistName;
    private String image;
    private int unitPrice;
    private int quantity;
    private int subtotal;
    /** Stock disponible en el catalogo, para avisar antes de intentar comprar. */
    private int stock;
    private boolean available;
}
