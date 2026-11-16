package com.uade.tpo.marketplace.exceptions.unprocessable;

import com.uade.tpo.marketplace.exceptions.UnprocessableEntityException;

public class ReviewNotAllowedException extends UnprocessableEntityException {
    public ReviewNotAllowedException() {
        super("Solo podes reseñar vinilos que hayas comprado");
    }
}
