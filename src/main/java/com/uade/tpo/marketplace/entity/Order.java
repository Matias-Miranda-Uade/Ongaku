package com.uade.tpo.marketplace.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column
    private double total;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_status_id")
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    @JsonIgnore
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order")
    @JsonIgnore
    private List<Payment> payment;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public OrderItem addItem(Vinyl vinyl, int quantity) {
        OrderItem item = new OrderItem(this, vinyl, quantity);
        items.add(item);
        return item;
    }

    public OrderStatusType getStatusType() {
        return orderStatus == null ? null : OrderStatusType.fromId(orderStatus.getId());
    }

    public int getTotalProducts() {
        return items.size();
    }

    public int getTotalUnits() {
        return items.stream().mapToInt(OrderItem::getQuantity).sum();
    }
}
