package com.uade.tpo.marketplace.exceptions.unprocessable;

import com.uade.tpo.marketplace.exceptions.UnprocessableEntityException;

public class VinylNotPurchasableException extends UnprocessableEntityException {
    public VinylNotPurchasableException(String message) {
        super(message);
    }
}
