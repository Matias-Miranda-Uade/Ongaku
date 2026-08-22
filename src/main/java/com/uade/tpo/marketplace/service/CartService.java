package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Cart;
import java.util.ArrayList;

public interface CartService {
    ArrayList<Cart> getCarts();
    Cart getCartById(int cartId);
    Cart createCart(String entity);
}
