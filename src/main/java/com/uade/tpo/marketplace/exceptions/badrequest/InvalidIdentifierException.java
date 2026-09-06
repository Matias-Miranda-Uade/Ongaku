package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidIdentifierException extends BadRequestException {
    public InvalidIdentifierException(String field, Object value) {
        super("El identificador '" + field + "' es invalido: " + value);
    }
    public InvalidIdentifierException(String message) {
        super(message);
    }
}
