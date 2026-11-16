package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class VinylAlreadyOrderedException extends ConflictException {
    public VinylAlreadyOrderedException() {
        super("El vinilo forma parte de ordenes existentes: deshabilitalo en lugar de borrarlo "
                + "para no perder el historial de compras");
    }
}
