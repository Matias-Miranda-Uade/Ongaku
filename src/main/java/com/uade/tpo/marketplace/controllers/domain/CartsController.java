package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import com.uade.tpo.marketplace.entity.dto.CartResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.CartMapper;
import com.uade.tpo.marketplace.service.CartService;

@RestController
@RequestMapping("/carts")
public class CartsController {
    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponse>>> getCarts(Principal principal) {
        List<CartResponse> carts = cartService.getCarts(principal.getName()).stream().map(CartMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(carts, "No hay carritos cargados"));
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCartById(@PathVariable int cartId, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cartService.getCartById(cartId, principal.getName()))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> createCart(@RequestBody(required = false) CartRequest request, Principal principal) {
        CartResponse response = CartMapper.toResponse(cartService.createCart(request, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Vinilo agregado al carrito"));
    }
    @PostMapping("/{cartId}/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(@PathVariable int cartId,
            @RequestBody CartRequest request, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cartService.addItem(
                cartId, request.getVinylId(), request.getQuantity(), principal.getName()))));
    }

    @PatchMapping("/{cartId}/items/{vinylId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(@PathVariable int cartId,
            @PathVariable int vinylId, @RequestBody com.uade.tpo.marketplace.entity.dto.CartQuantityRequest request,
            Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cartService.updateQuantity(
                cartId, vinylId, request.quantity(), principal.getName()))));
    }

    @DeleteMapping("/{cartId}/items/{vinylId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(@PathVariable int cartId,
            @PathVariable int vinylId, Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cartService.removeItem(
                cartId, vinylId, principal.getName()))));
    }
}