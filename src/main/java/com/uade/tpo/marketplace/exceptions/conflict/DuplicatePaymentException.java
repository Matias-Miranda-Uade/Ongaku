package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class DuplicatePaymentException extends ConflictException {
    public DuplicatePaymentException() {
        super("Ya existe un pago registrado para esta orden");
    }
}
