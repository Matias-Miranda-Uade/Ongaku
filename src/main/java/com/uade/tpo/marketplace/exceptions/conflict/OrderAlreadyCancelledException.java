package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class OrderAlreadyCancelledException extends ConflictException {
    public OrderAlreadyCancelledException() {
        super("La orden ya esta cancelada");
    }
}
