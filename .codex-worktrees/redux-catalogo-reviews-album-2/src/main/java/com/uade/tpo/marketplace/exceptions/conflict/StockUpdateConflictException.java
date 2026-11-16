package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class StockUpdateConflictException extends ConflictException {
    public StockUpdateConflictException() {
        super("La actualizacion de stock generaria un valor negativo, es posible que otro usuario haya comprado antes");
    }
}
