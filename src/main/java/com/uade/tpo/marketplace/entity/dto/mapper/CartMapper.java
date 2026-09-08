package com.uade.tpo.marketplace.entity.dto.mapper;

import java.util.List;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.CartItem;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.CartItemResponse;
import com.uade.tpo.marketplace.entity.dto.CartResponse;

public final class CartMapper {

    private CartMapper() {
    }

    public static CartResponse toResponse(Cart cart) {
        if (cart == null) return null;
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);
        List<CartItemResponse> items = cart.getItems().stream().map(CartMapper::toItemResponse).toList();
        response.setItems(items);
        response.setTotalProducts(cart.getTotalProducts());
        response.setTotalUnits(cart.getTotalUnits());
        response.setTotal(cart.getTotal());
        response.setEmpty(cart.isEmpty());
        return response;
    }

    public static CartItemResponse toItemResponse(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        Vinyl vinyl = item.getVinyl();
        response.setVinylId(vinyl != null ? vinyl.getId() : null);
        response.setName(vinyl != null ? vinyl.getName() : null);
        response.setArtistName(vinyl != null && vinyl.getArtist() != null ? vinyl.getArtist().getName() : null);
        response.setImage(vinyl != null ? vinyl.getImage() : null);
        response.setUnitPrice(vinyl != null ? vinyl.getPrice() : 0);
        response.setQuantity(item.getQuantity());
        response.setSubtotal(item.getSubtotal());
        response.setStock(vinyl != null ? vinyl.getStock() : 0);
        response.setAvailable(item.isAvailable());
        return response;
    }
}
