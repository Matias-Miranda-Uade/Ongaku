package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

/** Admite el estado por nombre ("CANCELADA") o por id del catalogo. */
@Data
public class OrderStatusUpdateRequest {
    private String status;
    private Integer orderStatusId;
}
