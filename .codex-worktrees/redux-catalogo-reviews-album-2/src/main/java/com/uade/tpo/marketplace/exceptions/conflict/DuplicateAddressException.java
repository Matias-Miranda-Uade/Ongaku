package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class DuplicateAddressException extends ConflictException {
    public DuplicateAddressException() {
        super("Ya existe una dirección con el mismo nombre de quien recibe y teléfono.");
    }
}
