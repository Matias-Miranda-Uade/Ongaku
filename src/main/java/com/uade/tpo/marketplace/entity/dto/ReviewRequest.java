package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    /** Opcional: si viene, debe coincidir con el usuario autenticado. */
    private int userId;
    private int vinylId;
    private String comment;
    private Integer score;
}
