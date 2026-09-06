package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class FavoriteAlreadyExistsException extends ConflictException {
    public FavoriteAlreadyExistsException() {
        super("El vinilo ya esta en favoritos");
    }
}
