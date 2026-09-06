package com.uade.tpo.marketplace.exceptions.auth;

import com.uade.tpo.marketplace.exceptions.UnauthorizedException;

public class MissingTokenException extends UnauthorizedException {
    public MissingTokenException() {
        super("Falta el header Authorization con el token Bearer");
    }
}
