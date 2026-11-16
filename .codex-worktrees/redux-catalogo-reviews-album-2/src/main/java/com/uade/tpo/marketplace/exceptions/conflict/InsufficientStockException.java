package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class InsufficientStockException extends ConflictException {
    public InsufficientStockException() {
        super("No hay stock suficiente para esta operacion");
    }
    public InsufficientStockException(String message) {
        super(message);
    }
}
