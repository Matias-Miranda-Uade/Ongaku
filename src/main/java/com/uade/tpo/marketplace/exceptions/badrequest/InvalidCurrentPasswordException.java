package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidCurrentPasswordException extends BadRequestException {
    public InvalidCurrentPasswordException() {
        super("La contraseña actual es incorrecta");
    }
}
