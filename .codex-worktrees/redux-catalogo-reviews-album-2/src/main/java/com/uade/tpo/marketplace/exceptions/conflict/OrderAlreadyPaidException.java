package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class OrderAlreadyPaidException extends ConflictException {
    public OrderAlreadyPaidException() {
        super("La orden ya fue pagada");
    }
}
