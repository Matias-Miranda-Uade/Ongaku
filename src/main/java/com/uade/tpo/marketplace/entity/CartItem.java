package com.uade.tpo.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/** Linea del carrito: un vinilo y la cantidad elegida por el usuario. */
@Getter
@Setter
@Entity
@Table(name = "cart_item", uniqueConstraints = @UniqueConstraint(name = "uk_cart_item_cart_vinyl",
        columnNames = {"cart_id", "vinyl_id"}))
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vinyl_id", nullable = false)
    private Vinyl vinyl;

    @Column(nullable = false)
    private int quantity;

    public CartItem() {
    }

    public CartItem(Cart cart, Vinyl vinyl, int quantity) {
        this.cart = cart;
        this.vinyl = vinyl;
        this.quantity = quantity;
    }

    /** El precio del carrito siempre se lee del catalogo, nunca del cliente. */
    public int getSubtotal() {
        return vinyl == null ? 0 : vinyl.getFinalPrice() * quantity;
    }

    /** Falso si el vinilo se deshabilito o si ya no hay stock para la cantidad elegida. */
    public boolean isAvailable() {
        return vinyl != null && !Boolean.FALSE.equals(vinyl.getEnabled()) && vinyl.getStock() >= quantity;
    }
}
