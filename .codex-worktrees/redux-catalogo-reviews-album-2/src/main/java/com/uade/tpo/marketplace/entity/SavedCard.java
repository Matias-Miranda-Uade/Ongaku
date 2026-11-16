package com.uade.tpo.marketplace.entity;

import jakarta.persistence.*;

@Entity
public class SavedCard {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @ManyToOne(optional=false) @JoinColumn(name="user_id",nullable=false) public User user;
    @Column(nullable=false,length=120) public String holder;
    @Column(nullable=false,length=20) public String brand;
    @Column(nullable=false,length=4) public String lastFour;
    @Column(nullable=false) public int expiryMonth;
    @Column(nullable=false) public int expiryYear;
}
