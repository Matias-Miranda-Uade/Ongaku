package com.uade.tpo.marketplace.exceptions.unprocessable;

import com.uade.tpo.marketplace.exceptions.UnprocessableEntityException;

public class OrderCannotBeCreatedException extends UnprocessableEntityException {
    public OrderCannotBeCreatedException(String message) {
        super(message);
    }
}
