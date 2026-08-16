package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Cart;

public class CartRepository {
    public ArrayList<Cart> carts = new ArrayList<>(Arrays.asList(
            Cart.builder().id(1).userId(1).vinylId(10).quantity(1).build(),
            Cart.builder().id(2).userId(2).vinylId(11).quantity(2).build(),
            Cart.builder().id(3).userId(3).vinylId(12).quantity(1).build()
    ));

    public ArrayList<Cart> getCarts() {
        return this.carts;
    }

    public Cart getCartById(int cartId) {
        return null;
    }

    public Cart createCart(String entity) {
        return null;
    }
}
