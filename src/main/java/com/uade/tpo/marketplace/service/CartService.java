package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.repository.CartRepository;

public class CartService {
    
    public ArrayList<Cart> getCarts() {
        CartRepository cartRepository = new CartRepository();
        return cartRepository.getCarts();
    }

    public Cart getCartById(int cartId) {
        CartRepository cartRepository = new CartRepository();
        return cartRepository.getCartById(cartId);
    }

    public Cart createCart(String entity) {
        CartRepository cartRepository = new CartRepository();
        return cartRepository.createCart(entity);
    }
}
