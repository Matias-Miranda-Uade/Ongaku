package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.CartItemAlreadyExistsException;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException;
import com.uade.tpo.marketplace.exceptions.forbidden.ResourceOwnershipException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    public CartServiceImpl(
            CartRepository cartRepository,
            VinylRepository vinylRepository,
            OwnershipGuard ownershipGuard) {

        this.cartRepository = cartRepository;
        this.vinylRepository = vinylRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @Override
    public ArrayList<Cart> getCarts() {
        return new ArrayList<>(cartRepository.findAll());
    }

    @Override
    public Cart getCartById(int id, String requesterEmail) {
        Cart cart = cartRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", id));

        Long ownerId = cart.getUser() != null ? cart.getUser().getId() : null;
        ownershipGuard.assertSelfOrAdmin(requesterEmail, ownerId);

        return cart;
    }

    @Override
    public Cart createCart(CartRequest request, String requesterEmail) {

        if (request == null) {
            throw new InvalidRequestException("El carrito requiere usuario y vinilo");
        }
        if (request.getUserId() <= 0) {
            throw new InvalidFieldException("userId", "debe ser un identificador positivo");
        }
        if (request.getVinylId() <= 0) {
            throw new InvalidFieldException("vinylId", "debe ser un identificador positivo");
        }

        User user = ownershipGuard.assertSelfOrAdmin(requesterEmail, (long) request.getUserId());

        Vinyl vinyl = vinylRepository.findById((long) request.getVinylId())
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", request.getVinylId()));

        if (Boolean.FALSE.equals(vinyl.getEnabled())) {
            throw new ProductDisabledException();
        }

        if (vinyl.getStock() <= 0) {
            throw new InsufficientStockException("El vinilo esta agotado");
        }

        Cart cart = cartRepository.findByUserId(request.getUserId())
                .stream()
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

        if (items.contains(vinyl)) {
            throw new CartItemAlreadyExistsException();
        }

        items.add(vinyl);

        return cartRepository.save(cart);
    }
}