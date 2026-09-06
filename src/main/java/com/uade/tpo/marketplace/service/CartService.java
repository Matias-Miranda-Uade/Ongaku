package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import java.util.ArrayList;

public interface CartService {
    ArrayList<Cart> getCarts();
    Cart getCartById(int cartId, String requesterEmail);
    Cart createCart(CartRequest request, String requesterEmail);
}