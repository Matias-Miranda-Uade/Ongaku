package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.CartRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Cart> getCarts(String requesterEmail) {
        User user = ownershipGuard.requireCustomer(requesterEmail);
        return new ArrayList<>(cartRepository.findByUserId(Math.toIntExact(user.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public Cart getCartById(int id, String requesterEmail) {
        Cart cart = cartRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", id));
        ownershipGuard.assertOwner(requesterEmail, cart.getUser() == null ? null : cart.getUser().getId());
        return cart;
    }

    @Override
    public Cart createCart(CartRequest request, String requesterEmail) {
        User user = ownershipGuard.requireCustomerForUpdate(requesterEmail);
        if (request != null && request.getUserId() != 0) {
            ownershipGuard.assertOwner(requesterEmail, (long) request.getUserId());
        }
        Cart cart = cartRepository.findByUserId(Math.toIntExact(user.getId())).stream()
                .findFirst().map(existing -> ownedCartForUpdate(Math.toIntExact(existing.getId()), requesterEmail))
                .orElseGet(() -> {
                    Cart created = new Cart();
                    created.setUser(user);
                    created.setItems(new ArrayList<>());
                    return created;
                });
        if (request != null && request.getVinylId() != 0) {
            addToCart(cart, request.getVinylId(), request.getQuantity());
        }
        return cartRepository.save(cart);
    }

    @Override
    public Cart addItem(int cartId, int vinylId, int quantity, String requesterEmail) {
        Cart cart = ownedCartForUpdate(cartId, requesterEmail);
        addToCart(cart, vinylId, quantity);
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateQuantity(int cartId, int vinylId, int quantity, String requesterEmail) {
        Cart cart = ownedCartForUpdate(cartId, requesterEmail);
        Vinyl vinyl = requireItem(cart, vinylId);
        validateQuantity(vinyl, quantity);
        cart.getQuantities().put(vinyl.getId(), quantity);
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItem(int cartId, int vinylId, String requesterEmail) {
        Cart cart = ownedCartForUpdate(cartId, requesterEmail);
        Vinyl vinyl = requireItem(cart, vinylId);
        cart.getItems().removeIf(item -> item.getId().equals(vinyl.getId()));
        cart.getQuantities().remove(vinyl.getId());
        return cartRepository.save(cart);
    }

    private Cart ownedCartForUpdate(int cartId, String requesterEmail) {
        Cart cart = cartRepository.findForUpdateById((long) cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", cartId));
        ownershipGuard.assertOwner(requesterEmail, cart.getUser() == null ? null : cart.getUser().getId());
        return cart;
    }

    private Vinyl requireItem(Cart cart, int vinylId) {
        return cart.getItems().stream().filter(item -> item.getId().equals((long) vinylId))
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Articulo del carrito", vinylId));
    }

    private void addToCart(Cart cart, int vinylId, int quantity) {
        if (vinylId <= 0) throw new InvalidFieldException("vinylId", "debe ser positivo");
        if (quantity <= 0) throw new InvalidFieldException("quantity", "debe ser mayor a cero");
        Vinyl vinyl = vinylRepository.findById((long) vinylId)
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", vinylId));
        boolean exists = cart.getItems().stream().anyMatch(item -> item.getId().equals(vinyl.getId()));
        long total = (exists ? cart.quantityOf(vinyl.getId()) : 0L) + quantity;
        if (total > Integer.MAX_VALUE) throw new InvalidFieldException("quantity", "es demasiado grande");
        validateQuantity(vinyl, (int) total);
        if (!exists) cart.getItems().add(vinyl);
        cart.getQuantities().put(vinyl.getId(), (int) total);
    }

    private void validateQuantity(Vinyl vinyl, int quantity) {
        if (quantity <= 0) throw new InvalidFieldException("quantity", "debe ser mayor a cero");
        if (Boolean.FALSE.equals(vinyl.getEnabled())) throw new ProductDisabledException();
        if (quantity > vinyl.getStock()) throw new InsufficientStockException("No hay stock para esa cantidad");
    }
}
