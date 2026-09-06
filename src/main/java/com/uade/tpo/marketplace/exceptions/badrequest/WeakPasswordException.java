package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class WeakPasswordException extends BadRequestException {
    public WeakPasswordException() {
        super("La contraseña debe tener al menos ocho caracteres");
    }
}
