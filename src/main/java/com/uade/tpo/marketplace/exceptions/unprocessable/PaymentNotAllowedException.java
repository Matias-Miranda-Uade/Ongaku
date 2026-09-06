package com.uade.tpo.marketplace.exceptions.unprocessable;

import com.uade.tpo.marketplace.exceptions.UnprocessableEntityException;

public class PaymentNotAllowedException extends UnprocessableEntityException {
    public PaymentNotAllowedException(String message) {
        super(message);
    }
}
