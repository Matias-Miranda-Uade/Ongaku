package com.uade.tpo.marketplace.exceptions.forbidden;

import com.uade.tpo.marketplace.exceptions.ForbiddenException;

public class ForbiddenOperationException extends ForbiddenException {
    public ForbiddenOperationException() {
        super("No tenes permisos para realizar esta operacion");
    }
    public ForbiddenOperationException(String message) {
        super(message);
    }
}
