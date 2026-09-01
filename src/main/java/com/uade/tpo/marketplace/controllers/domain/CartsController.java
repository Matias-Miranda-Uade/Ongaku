package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import com.uade.tpo.marketplace.service.CartService;

@RestController
@RequestMapping("/carts")
public class CartsController {
    @Autowired private CartService cartService;

    @GetMapping
    public ArrayList<Cart> getCarts() { return cartService.getCarts(); }

    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCartById(@PathVariable int cartId) {
        Cart cart = cartService.getCartById(cartId);
        return cart == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestBody CartRequest request) {
        String entity = request.getUserId() + "," + request.getVinylId();
        return ResponseEntity.ok(cartService.createCart(entity));
    }
}
