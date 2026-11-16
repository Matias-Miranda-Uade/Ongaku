package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class CartItemAlreadyExistsException extends ConflictException {
    public CartItemAlreadyExistsException() {
        super("El vinilo ya esta en el carrito");
    }
}
