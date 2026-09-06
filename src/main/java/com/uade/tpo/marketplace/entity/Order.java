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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String orderDate;

    @Column
    private double total;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "order_vinyl",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "vinyl_id")
    )
    private List<Vinyl> vinyl;

    @ManyToOne
    @JoinColumn(name = "order_status_id")
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order")
    private List<Payment> payment;
    // Existing items without a quantity entry represent one unit.
    @ElementCollection
    @CollectionTable(name = "order_item_quantities", joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyColumn(name = "vinyl_id")
    @Column(name = "quantity", nullable = false)
    private Map<Long, Integer> quantities = new HashMap<>();

    public int quantityOf(Long vinylId) {
        return quantities.getOrDefault(vinylId, 1);
    }
}
