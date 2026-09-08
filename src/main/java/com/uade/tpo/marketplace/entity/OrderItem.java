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
import lombok.Getter;
import lombok.Setter;

/**
 * Linea de una orden. Guarda una foto del producto al momento de la compra
 * (nombre, artista y precio unitario) para que la orden no cambie si despues
 * se edita o se da de baja el vinilo.
 */
@Getter
@Setter
@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    // Los datos que se muestran ya estan copiados en esta misma fila; la
    // referencia al catalogo solo hace falta para reponer stock al cancelar.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vinyl_id")
    private Vinyl vinyl;

    @Column(name = "vinyl_name", nullable = false)
    private String vinylName;

    @Column(name = "artist_name")
    private String artistName;

    @Column(name = "image")
    private String image;

    @Column(name = "unit_price", nullable = false)
    private int unitPrice;

    @Column(nullable = false)
    private int quantity;

    public OrderItem() {
    }

    public OrderItem(Order order, Vinyl vinyl, int quantity) {
        this.order = order;
        this.vinyl = vinyl;
        this.quantity = quantity;
        this.vinylName = vinyl.getName();
        this.artistName = vinyl.getArtist() != null ? vinyl.getArtist().getName() : null;
        this.image = vinyl.getImage();
        this.unitPrice = vinyl.getPrice();
    }

    public int getSubtotal() {
        return unitPrice * quantity;
    }
}
