package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.dto.CartItemRequest;
import com.uade.tpo.marketplace.entity.dto.CartQuantityRequest;
import com.uade.tpo.marketplace.entity.dto.CartResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.CartMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.service.CartService;

/**
 * Carrito del usuario autenticado. No hace falta pasar el id del carrito: cada
 * usuario tiene el suyo y solo puede operar sobre ese.
 */
@RestController
@RequestMapping("/carts")
public class CartsController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getMyCart(Principal principal) {
        return ok(cartService.getMyCart(principal.getName()));
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCartById(@PathVariable long cartId, Principal principal) {
        return ok(cartService.getCartById(cartId, principal.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(@RequestBody CartItemRequest request, Principal principal) {
        if (request == null) {
            throw new InvalidRequestException("Indica el vinilo y la cantidad a agregar");
        }
        Cart cart = cartService.addItem(principal.getName(), request.getVinylId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cart), "Vinilo agregado al carrito"));
    }

    @PatchMapping("/items/{vinylId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(@PathVariable long vinylId, @RequestBody CartQuantityRequest request, Principal principal) {
        if (request == null) {
            throw new InvalidRequestException("Indica la nueva cantidad");
        }
        Cart cart = cartService.updateQuantity(principal.getName(), vinylId, request.quantity());
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cart), "Cantidad actualizada"));
    }

    @DeleteMapping("/items/{vinylId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(@PathVariable long vinylId, Principal principal) {
        Cart cart = cartService.removeItem(principal.getName(), vinylId);
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cart), "Vinilo eliminado del carrito"));
    }

    @DeleteMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> clear(Principal principal) {
        Cart cart = cartService.clear(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok(CartMapper.toResponse(cart), "Carrito vaciado"));
    }

    private ResponseEntity<ApiResponse<CartResponse>> ok(Cart cart) {
        CartResponse response = CartMapper.toResponse(cart);
        String message = response.isEmpty() ? "El carrito está vacío" : "El carrito tiene " + response.getTotalProducts() + " producto(s)";
        return ResponseEntity.ok(ApiResponse.ok(response, message));
    }

    public CartsController(CartService cartService) {
        this.cartService = cartService;
    }
}
