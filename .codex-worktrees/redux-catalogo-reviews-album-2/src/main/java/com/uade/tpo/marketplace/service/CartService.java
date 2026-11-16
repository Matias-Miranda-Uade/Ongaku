package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.entity.User;

public interface CartService {

    /** Crea el carrito vacio del usuario. Se invoca al registrarse. */
    Cart createCartFor(User user);

    /** Carrito del usuario autenticado (se crea vacio si todavia no existe). */
    Cart getMyCart(String requesterEmail);

    Cart getCartById(long cartId, String requesterEmail);

    Cart addItem(String requesterEmail, long vinylId, int quantity);

    Cart updateQuantity(String requesterEmail, long vinylId, int quantity);

    Cart removeItem(String requesterEmail, long vinylId);

    Cart clear(String requesterEmail);
}
