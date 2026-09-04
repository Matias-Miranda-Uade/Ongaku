package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.dto.CartResponse;

public interface CartService {
    CartResponse getCart(String email);
    CartResponse addItem(String email, int vinylId, int quantity);
    CartResponse updateItem(String email, int vinylId, int quantity);
    CartResponse removeItem(String email, int vinylId);
}
