package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class EmptyCartException extends ConflictException {
    public EmptyCartException() {
        super("El carrito está vacío");
    }
}
