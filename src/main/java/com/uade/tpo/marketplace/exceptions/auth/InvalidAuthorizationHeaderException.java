package com.uade.tpo.marketplace.exceptions.auth;

import com.uade.tpo.marketplace.exceptions.UnauthorizedException;

public class InvalidAuthorizationHeaderException extends UnauthorizedException {
    public InvalidAuthorizationHeaderException() {
        super("El header Authorization debe tener el formato 'Bearer <token>'");
    }
}
