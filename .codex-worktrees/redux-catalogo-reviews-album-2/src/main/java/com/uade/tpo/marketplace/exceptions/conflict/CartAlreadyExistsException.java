package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class CartAlreadyExistsException extends ConflictException {
    public CartAlreadyExistsException() {
        super("El usuario ya tiene un carrito");
    }
}
