package com.uade.tpo.marketplace.exceptions.notfound;

import com.uade.tpo.marketplace.exceptions.NotFoundException;

public class ResourceNotFoundException extends NotFoundException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " con id " + id + " no existe");
    }
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
