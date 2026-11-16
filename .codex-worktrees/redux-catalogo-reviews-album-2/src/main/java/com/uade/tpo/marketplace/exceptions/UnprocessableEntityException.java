package com.uade.tpo.marketplace.exceptions;

public abstract class UnprocessableEntityException extends RuntimeException {
    protected UnprocessableEntityException(String message) {
        super(message);
    }
}