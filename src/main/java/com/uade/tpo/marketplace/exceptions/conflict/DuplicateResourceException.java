package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class DuplicateResourceException extends ConflictException {
    public DuplicateResourceException(String resource, String value) {
        super(resource + " duplicado: " + value);
    }
    public DuplicateResourceException(String message) {
        super(message);
    }
}
