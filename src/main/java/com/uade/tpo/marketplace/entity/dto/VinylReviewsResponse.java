package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

import lombok.Data;

/** Bloque de reseñas de un producto, como en la ficha de detalle de un ecommerce. */
@Data
public class VinylReviewsResponse {
    private Long vinylId;
    private String vinylName;
    private int totalReviews;
    private double averageScore;
    private List<ReviewResponse> reviews;
}
