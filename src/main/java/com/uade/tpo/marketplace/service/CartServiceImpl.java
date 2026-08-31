package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final VinylRepository vinylRepository;

    public CartServiceImpl(
            CartRepository cartRepository,
            UserRepository userRepository,
            VinylRepository vinylRepository) {

        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Cart> getCarts() {
        return new ArrayList<>(cartRepository.findAll());
    }

    @Override
    public Cart getCartById(int id) {
        return cartRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Cart createCart(String entity) {

        String[] values = entity == null
                ? new String[0]
                : entity.split(",");

        if (values.length < 2) {
            throw new IllegalArgumentException(
                    "El carrito requiere usuario y vinilo");
        }

        int userId = Integer.parseInt(values[0].trim());
        int vinylId = Integer.parseInt(values[1].trim());

        if (userId <= 0 || vinylId <= 0) {
            throw new IllegalArgumentException(
                    "Los identificadores deben ser positivos");
        }

        User user = userRepository
                .findById((long) userId)
                .orElse(null);

        if (user == null) {
            throw new IllegalArgumentException(
                    "El usuario no existe");
        }

        Vinyl vinyl = vinylRepository
                .findById((long) vinylId)
                .orElse(null);

        if (vinyl == null) {
            throw new IllegalArgumentException(
                    "El vinilo no existe");
        }

        Cart cart = cartRepository.findAll()
                .stream()
                .filter(c -> c.getUser() != null
                        && c.getUser().getId().equals((long) userId))
                .findFirst()
                .orElse(null);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
        }

        List<Vinyl> items = cart.getItems();

        if (items == null) {
            items = new ArrayList<>();
            cart.setItems(items);
        }

        if (!items.contains(vinyl)) {
            items.add(vinyl);
        }

        return cartRepository.save(cart);
    }
}