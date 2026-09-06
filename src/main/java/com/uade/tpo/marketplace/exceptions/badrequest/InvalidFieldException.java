package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidFieldException extends BadRequestException {
    public InvalidFieldException(String field, String reason) {
        super("Campo invalido '" + field + "': " + reason);
    }
    public InvalidFieldException(String message) {
        super(message);
    }
}
