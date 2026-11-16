package com.uade.tpo.marketplace.exceptions.conflict;

import com.uade.tpo.marketplace.exceptions.ConflictException;

public class DuplicateReviewException extends ConflictException {
    public DuplicateReviewException() {
        super("Ya publicaste una reseña para este vinilo");
    }
}
