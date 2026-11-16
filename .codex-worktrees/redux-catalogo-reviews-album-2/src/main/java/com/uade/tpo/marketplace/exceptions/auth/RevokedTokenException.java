package com.uade.tpo.marketplace.exceptions.auth;

import com.uade.tpo.marketplace.exceptions.UnauthorizedException;

public class RevokedTokenException extends UnauthorizedException {
    public RevokedTokenException() {
        super("El token fue invalidado, inicia sesion nuevamente");
    }
}
