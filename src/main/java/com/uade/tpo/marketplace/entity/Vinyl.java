package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Vinyl {

    private int id;
    private String name;
    private String description;
    private int price;
    private int stock;
    private String image;
    private Category category;
    private Artist artist;
    private Genre genre;
    private int year;
}
