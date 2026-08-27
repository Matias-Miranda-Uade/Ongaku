package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Vinyl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private int price;

    @Column
    private int stock;

    @Column
    private String image;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Artist artist;

    @ManyToOne
    private Genre genre;

    @OneToOne
    private AudioPreview audioPreview;

    @Column
    private int year;
}
