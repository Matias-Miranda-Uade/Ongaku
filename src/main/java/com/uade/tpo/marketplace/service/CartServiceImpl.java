package com.uade.tpo.marketplace.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.CartItem;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.conflict.InsufficientStockException;
import com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
@Transactional
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    @Override
    public Cart createCartFor(User user) {
        return cartRepository.findFirstByUser_IdOrderByIdAsc(user.getId()).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @Override
    public Cart getMyCart(String requesterEmail) {
        User user = ownershipGuard.requireCustomer(requesterEmail);
        return createCartFor(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Cart getCartById(long cartId, String requesterEmail) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new ResourceNotFoundException("Carrito", cartId));
        ownershipGuard.assertOwner(requesterEmail, cart.getUser() == null ? null : cart.getUser().getId());
        return cart;
    }

    @Override
    public Cart addItem(String requesterEmail, long vinylId, int quantity) {
        Cart cart = myCartForUpdate(requesterEmail);
        if (quantity <= 0) throw new InvalidFieldException("quantity", "debe ser mayor a cero");
        Vinyl vinyl = requireVinyl(vinylId);
        CartItem existing = cart.findItem(vinyl.getId()).orElse(null);
        long total = (existing == null ? 0L : existing.getQuantity()) + quantity;
        if (total > Integer.MAX_VALUE) throw new InvalidFieldException("quantity", "es demasiado grande");
        validateQuantity(vinyl, (int) total);
        if (existing == null) {
            cart.addItem(vinyl, (int) total);
        } else {
            existing.setQuantity((int) total);
        }
        return persist(cart);
    }

    @Override
    public Cart updateQuantity(String requesterEmail, long vinylId, int quantity) {
        Cart cart = myCartForUpdate(requesterEmail);
        CartItem item = requireItem(cart, vinylId);
        validateQuantity(item.getVinyl(), quantity);
        item.setQuantity(quantity);
        return persist(cart);
    }

    @Override
    public Cart removeItem(String requesterEmail, long vinylId) {
        Cart cart = myCartForUpdate(requesterEmail);
        cart.removeItem(requireItem(cart, vinylId));
        return persist(cart);
    }

    @Override
    public Cart clear(String requesterEmail) {
        Cart cart = myCartForUpdate(requesterEmail);
        cart.clear();
        return persist(cart);
    }

    /**
     * El carrito ya esta administrado por la transaccion: alcanza con vaciar los
     * cambios pendientes. Un save() aqui haria un merge que rompe el borrado
     * automatico de las lineas quitadas.
     */
    private Cart persist(Cart cart) {
        cartRepository.flush();
        return cart;
    }

    /**
     * Toma el carrito propio con bloqueo de escritura: nadie mas puede tocarlo
     * (ni el checkout) mientras se modifica.
     */
    private Cart myCartForUpdate(String requesterEmail) {
        User user = ownershipGuard.requireCustomer(requesterEmail);
        return cartRepository.findForUpdateByUserId(user.getId()).stream().findFirst().orElseGet(() -> createCartFor(user));
    }

    private Vinyl requireVinyl(long vinylId) {
        if (vinylId <= 0) throw new InvalidFieldException("vinylId", "debe ser positivo");
        return vinylRepository.findById(vinylId).orElseThrow(() -> new ResourceNotFoundException("Vinilo", vinylId));
    }

    private CartItem requireItem(Cart cart, long vinylId) {
        return cart.findItem(vinylId).orElseThrow(() -> new ResourceNotFoundException("Articulo del carrito", vinylId));
    }

    private void validateQuantity(Vinyl vinyl, int quantity) {
        if (quantity <= 0) throw new InvalidFieldException("quantity", "debe ser mayor a cero");
        if (Boolean.FALSE.equals(vinyl.getEnabled())) throw new ProductDisabledException();
        if (quantity > vinyl.getStock()) {
            throw new InsufficientStockException("Solo quedan " + vinyl.getStock() + " unidades de \'" + vinyl.getName() + "\'");
        }
    }

    public CartServiceImpl(CartRepository cartRepository, VinylRepository vinylRepository, OwnershipGuard ownershipGuard) {
        this.cartRepository = cartRepository;
        this.vinylRepository = vinylRepository;
        this.ownershipGuard = ownershipGuard;
    }
}
