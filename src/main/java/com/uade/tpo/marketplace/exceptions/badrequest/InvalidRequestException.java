package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidRequestException extends BadRequestException {
    public InvalidRequestException(String message) {
        super(message);
    }
    public InvalidRequestException() {
        super("La solicitud es invalida o esta incompleta");
    }
}
