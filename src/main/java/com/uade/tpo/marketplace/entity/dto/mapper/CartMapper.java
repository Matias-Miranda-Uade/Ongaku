package com.uade.tpo.marketplace.entity.dto.mapper;

import java.util.Collections;
import java.util.List;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.dto.CartResponse;

public final class CartMapper {
    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {
        if (cart == null) return null;
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);
        List<com.uade.tpo.marketplace.entity.dto.VinylPreviewResponse> items = cart.getItems() == null
                ? Collections.emptyList()
                : cart.getItems().stream().map(VinylMapper::toPreviewResponse).toList();
        response.setItems(items);
        return response;
    }
}
