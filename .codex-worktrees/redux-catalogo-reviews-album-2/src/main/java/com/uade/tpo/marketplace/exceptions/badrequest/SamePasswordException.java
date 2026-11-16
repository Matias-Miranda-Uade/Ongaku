package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class SamePasswordException extends BadRequestException {
    public SamePasswordException() {
        super("La nueva contraseña debe ser diferente de la actual");
    }
}
