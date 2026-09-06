package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidPriceRangeException extends BadRequestException {
    public InvalidPriceRangeException() {
        super("El precio minimo no puede ser mayor que el precio maximo");
    }
    public InvalidPriceRangeException(String message) {
        super(message);
    }
}
