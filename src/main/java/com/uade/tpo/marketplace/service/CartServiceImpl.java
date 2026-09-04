package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.CartItem;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.CartItemResponse;
import com.uade.tpo.marketplace.entity.dto.CartResponse;
import com.uade.tpo.marketplace.entity.dto.VinylPreviewResponse;
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
    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene carrito"));
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(String email, int vinylId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        User user = findUser(email);
        Vinyl vinyl = vinylRepository.findByIdForUpdate((long) vinylId)
                .orElseThrow(() -> new IllegalArgumentException("El vinilo no existe"));
        Cart cart = cartRepository.findByUserIdForUpdate(user.getId())
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene carrito"));

        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getVinyl().getId().equals(vinyl.getId()))
                .findFirst()
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setVinyl(vinyl);
                    newItem.setQuantity(0);
                    cart.getItems().add(newItem);
                    return newItem;
                });

        if (item.getQuantity() + quantity > vinyl.getStock()) {
            throw new IllegalArgumentException("La cantidad supera el stock disponible");
        }
        item.setQuantity(item.getQuantity() + quantity);
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItem(String email, int vinylId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        Cart cart = getCartForUser(email);
        CartItem item = findItem(cart, vinylId);
        Vinyl vinyl = vinylRepository.findByIdForUpdate((long) vinylId)
            .orElseThrow(() -> new IllegalArgumentException("El vinilo no existe"));
        item.setVinyl(vinyl);
        if (quantity > vinyl.getStock()) {
            throw new IllegalArgumentException("La cantidad supera el stock disponible");
        }
        item.setQuantity(quantity);
        return toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse removeItem(String email, int vinylId) {
        Cart cart = getCartForUser(email);
        CartItem item = findItem(cart, vinylId);
        cart.getItems().remove(item);
        return toResponse(cartRepository.save(cart));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));
    }

    private Cart getCartForUser(String email) {
        User user = findUser(email);
        return cartRepository.findByUserIdForUpdate(user.getId())
                .orElseThrow(() -> new IllegalStateException("El usuario no tiene carrito"));
    }

    private CartItem findItem(Cart cart, int vinylId) {
        return cart.getItems().stream()
                .filter(item -> item.getVinyl().getId().equals((long) vinylId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("El producto no está en el carrito"));
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse response = new CartResponse();
        List<CartItemResponse> items = new ArrayList<>();
        double total = 0;
        for (CartItem item : cart.getItems()) {
            Vinyl vinyl = item.getVinyl();
            VinylPreviewResponse product = new VinylPreviewResponse();
            product.setId(vinyl.getId());
            product.setName(vinyl.getName());
            product.setImage(vinyl.getImage());
            product.setPrice(vinyl.getPrice());
            product.setYear(vinyl.getYear());
            product.setArtistName(vinyl.getArtist() == null ? null : vinyl.getArtist().getName());
            product.setCategoryDescription(vinyl.getCategory() == null ? null : vinyl.getCategory().getDescription());

            CartItemResponse itemResponse = new CartItemResponse();
            itemResponse.setProduct(product);
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setSubtotal((double) vinyl.getPrice() * item.getQuantity());
            items.add(itemResponse);
            total += itemResponse.getSubtotal();
        }
        response.setItems(items);
        response.setTotal(total);
        response.setMessage(items.isEmpty() ? "El carrito está vacío" : null);
        return response;
    }
}