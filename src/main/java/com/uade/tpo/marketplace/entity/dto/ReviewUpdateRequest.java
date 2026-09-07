package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

/** Edicion parcial de una reseña propia: se aplica solo lo que venga informado. */
@Data
public class ReviewUpdateRequest {
    private String comment;
    private Integer score;
}
