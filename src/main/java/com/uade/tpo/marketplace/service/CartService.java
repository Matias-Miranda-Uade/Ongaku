package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import java.util.ArrayList;

public interface CartService {
    ArrayList<Cart> getCarts(String requesterEmail);
    Cart getCartById(int cartId, String requesterEmail);
    Cart createCart(CartRequest request, String requesterEmail);
    Cart addItem(int cartId, int vinylId, int quantity, String requesterEmail);
    Cart updateQuantity(int cartId, int vinylId, int quantity, String requesterEmail);
    Cart removeItem(int cartId, int vinylId, String requesterEmail);
}