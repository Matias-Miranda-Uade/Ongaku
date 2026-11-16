package com.uade.tpo.marketplace.entity;

import jakarta.persistence.*;

@Entity
public class UserAddress {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @ManyToOne(optional=false) @JoinColumn(name="user_id", nullable=false) public User user;
    @Embedded public ShippingAddress details;
}
