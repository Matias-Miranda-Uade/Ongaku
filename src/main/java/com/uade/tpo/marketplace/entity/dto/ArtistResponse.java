package com.uade.tpo.marketplace.entity.dto;

import lombok.Data;

@Data
public class ArtistResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
}