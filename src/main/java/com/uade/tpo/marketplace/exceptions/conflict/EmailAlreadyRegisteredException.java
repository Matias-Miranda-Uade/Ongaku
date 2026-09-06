package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class EmailAlreadyRegisteredException extends ConflictException {
    public EmailAlreadyRegisteredException() {
        super("El email ya esta registrado");
    }
}
