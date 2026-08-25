package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository repository) {
        this.cartRepository = repository;
    }

    @Override
    public ArrayList<Cart> getCarts() {
        return new ArrayList<>(
            cartRepository.findAll()
        );
    }

    @Override
    public Cart getCartById(int id) {
        return cartRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Cart createCart(String entity) {

        String[] values =
                entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 3) {
            throw new IllegalArgumentException(
                "El carrito requiere usuario, vinilo y cantidad"
            );
        }

        int userId =
                Integer.parseInt(values[0].trim());

        int vinylId =
                Integer.parseInt(values[1].trim());

        int quantity =
                Integer.parseInt(values[2].trim());

        if (userId <= 0 ||
            vinylId <= 0 ||
            quantity <= 0) {

            throw new IllegalArgumentException(
                "Los datos del carrito deben ser positivos"
            );
        }

        Cart existing =
                cartRepository
                    .findByUserIdAndVinylId(
                        userId,
                        vinylId
                    )
                    .stream()
                    .findFirst()
                    .orElse(null);

        if (existing != null) {

            existing.setQuantity(
                existing.getQuantity() + quantity
            );

            return cartRepository.save(existing);
        }

        Cart cart = new Cart();

        cart.setUserId(userId);
        cart.setVinylId(vinylId);
        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }
}