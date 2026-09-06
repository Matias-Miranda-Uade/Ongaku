package com.uade.tpo.marketplace.exceptions.auth;

import com.uade.tpo.marketplace.exceptions.UnauthorizedException;

public class ExpiredTokenException extends UnauthorizedException {
    public ExpiredTokenException() {
        super("El token ha expirado");
    }
}
