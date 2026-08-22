package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    public CartServiceImpl(CartRepository repository) { this.cartRepository = repository; }
    public ArrayList<Cart> getCarts() { return cartRepository.getCarts(); }
    public Cart getCartById(int id) { return cartRepository.getCarts().stream().filter(c -> c.getId() == id).findFirst().orElse(null); }
    public Cart createCart(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",");
        if (values.length < 3) throw new IllegalArgumentException("El carrito requiere usuario, vinilo y cantidad");
        int userId = Integer.parseInt(values[0].trim()); int vinylId = Integer.parseInt(values[1].trim()); int quantity = Integer.parseInt(values[2].trim());
        if (userId <= 0 || vinylId <= 0 || quantity <= 0) throw new IllegalArgumentException("Los datos del carrito deben ser positivos");
        Cart existing = cartRepository.getCarts().stream().filter(c -> c.getUserId() == userId && c.getVinylId() == vinylId).findFirst().orElse(null);
        if (existing != null) { existing.setQuantity(existing.getQuantity() + quantity); return existing; }
        Cart cart = Cart.builder().id(cartRepository.getCarts().stream().mapToLong(Cart::getId).max().orElse(0) + 1).userId(userId).vinylId(vinylId).quantity(quantity).build();
        cartRepository.getCarts().add(cart); return cart;
    }
}