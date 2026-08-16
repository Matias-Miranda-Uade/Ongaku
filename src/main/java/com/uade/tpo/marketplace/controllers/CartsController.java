package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.service.CartService;

@RestController
@RequestMapping("carts")
public class CartsController {

    @GetMapping
    public ArrayList<Cart> getCarts() {
        CartService cartService = new CartService();
        return cartService.getCarts();
    }

    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable int cartId) {
        CartService cartService = new CartService();
        return cartService.getCartById(cartId);
    }

    @PostMapping
    public Cart createCart(@RequestBody String entity) {
        CartService cartService = new CartService();
        return cartService.createCart(entity);
    }
}
