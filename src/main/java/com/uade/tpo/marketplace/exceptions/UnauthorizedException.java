package com.uade.tpo.marketplace.exceptions;

public abstract class UnauthorizedException extends RuntimeException {
    protected UnauthorizedException(String message) {
        super(message);
    }
}