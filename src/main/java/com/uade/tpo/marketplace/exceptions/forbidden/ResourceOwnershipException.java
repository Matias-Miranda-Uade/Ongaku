package com.uade.tpo.marketplace.exceptions.forbidden;

import com.uade.tpo.marketplace.exceptions.ForbiddenException;

public class ResourceOwnershipException extends ForbiddenException {
    public ResourceOwnershipException() {
        super("No podes operar sobre un recurso que pertenece a otro usuario");
    }
    public ResourceOwnershipException(String message) {
        super(message);
    }
}
