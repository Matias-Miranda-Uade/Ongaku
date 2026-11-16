package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class InvalidOrderStatusTransitionException extends ConflictException {
    public InvalidOrderStatusTransitionException(String message) {
        super(message);
    }
}
