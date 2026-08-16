package com.uade.tpo.marketplace.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Product {
    private int id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private Category category;
    private Artist artist;
    private AudioPreview audioPreview;
}