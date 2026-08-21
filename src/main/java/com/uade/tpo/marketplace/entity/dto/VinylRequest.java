package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class VinylRequest {
    private String name;
    private String description;
    private int price;
    private int stock;
    private String image;
    private Long categoryId;
    private Long artistId;
    private Long genreId;
    private int year;
}
