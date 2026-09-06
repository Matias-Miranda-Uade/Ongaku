package com.uade.tpo.marketplace.entity;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Column;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "cart_vinyl",
        joinColumns = @JoinColumn(name = "cart_id"),
        inverseJoinColumns = @JoinColumn(name = "vinyl_id")
    )
    private List<Vinyl> items;
    // Existing items without a quantity entry represent one unit.
    @ElementCollection
    @CollectionTable(name = "cart_item_quantities", joinColumns = @JoinColumn(name = "cart_id"))
    @MapKeyColumn(name = "vinyl_id")
    @Column(name = "quantity", nullable = false)
    private Map<Long, Integer> quantities = new HashMap<>();

    public int quantityOf(Long vinylId) {
        return quantities.getOrDefault(vinylId, 1);
    }
}
