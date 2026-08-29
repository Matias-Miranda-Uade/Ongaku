package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String comment;

    //relacion muchos a uno con vinyl
    @ManyToOne
    @JoinColumn(name = "vinyl_id")
    private Vinyl vinyl;

    //relacion muchos a uno con usuario
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
