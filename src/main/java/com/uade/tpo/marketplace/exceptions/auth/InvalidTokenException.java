package com.uade.tpo.marketplace.exceptions.auth;

import com.uade.tpo.marketplace.exceptions.UnauthorizedException;

public class InvalidTokenException extends UnauthorizedException {
    public InvalidTokenException() {
        super("El token es invalido");
    }
    public InvalidTokenException(String message) {
        super(message);
    }
}
