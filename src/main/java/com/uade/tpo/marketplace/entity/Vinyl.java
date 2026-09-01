package com.uade.tpo.marketplace.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @OneToOne
    @JoinColumn(name = "audio_preview_id")
    private AudioPreview audioPreview;

    @Column
    private int year;

    @ManyToMany
    @JoinTable(
        name = "order_vinyl",
        joinColumns = @JoinColumn(name = "vinyl_id"),
        inverseJoinColumns = @JoinColumn(name = "order_id")
    )
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<Review> reviews;

    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<AverageScore> averageScores;

    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<Favorite> favorites;
}
