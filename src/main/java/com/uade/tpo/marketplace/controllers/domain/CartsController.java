package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.dto.CartRequest;
import com.uade.tpo.marketplace.entity.dto.CartResponse;
import com.uade.tpo.marketplace.service.CartService;

@RestController
@RequestMapping("/carts")
public class CartsController {
    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    @PostMapping("/products/{vinylId}")
    public ResponseEntity<CartResponse> addItem(
            Principal principal,
            @PathVariable int vinylId,
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addItem(principal.getName(), vinylId, request.getQuantity()));
    }

    @PutMapping("/products/{vinylId}")
    public ResponseEntity<CartResponse> updateItem(
            Principal principal,
            @PathVariable int vinylId,
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.updateItem(principal.getName(), vinylId, request.getQuantity()));
    }

    @DeleteMapping("/products/{vinylId}")
    public ResponseEntity<CartResponse> removeItem(Principal principal, @PathVariable int vinylId) {
        return ResponseEntity.ok(cartService.removeItem(principal.getName(), vinylId));
    }
}
