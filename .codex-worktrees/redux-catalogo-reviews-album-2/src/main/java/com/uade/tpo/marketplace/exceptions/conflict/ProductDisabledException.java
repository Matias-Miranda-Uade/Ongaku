package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class ProductDisabledException extends ConflictException {
    public ProductDisabledException() {
        super("El vinilo esta deshabilitado");
    }
}
