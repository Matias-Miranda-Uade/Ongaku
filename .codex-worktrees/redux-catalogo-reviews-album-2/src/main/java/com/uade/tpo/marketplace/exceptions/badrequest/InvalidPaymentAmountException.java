package com.uade.tpo.marketplace.exceptions.badrequest;

import com.uade.tpo.marketplace.exceptions.BadRequestException;

public class InvalidPaymentAmountException extends BadRequestException {
    public InvalidPaymentAmountException(String message) {
        super(message);
    }
}
