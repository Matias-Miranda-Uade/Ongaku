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

/**
 * Linea de una orden. Guarda una foto del producto al momento de la compra
 * (nombre, artista y precio unitario) para que la orden no cambie si despues
 * se edita o se da de baja el vinilo.
 */
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
    @Column(name = "original_price")
    private Integer originalPrice;
    @Column(nullable = false, columnDefinition = "integer default 0")
    private int discountPercentage = 0;

    /**
     * Las ordenes anteriores conservan el precio que se cobro.
     */
    public int getOriginalPrice() {
        return originalPrice == null ? unitPrice : originalPrice;
    }

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
        this.originalPrice = vinyl.getPrice();
        this.discountPercentage = vinyl.getDiscountPercentage();
        this.unitPrice = vinyl.getFinalPrice();
    }

    public int getSubtotal() {
        return unitPrice * quantity;
    }

    public Long getId() {
        return this.id;
    }

    public Order getOrder() {
        return this.order;
    }

    public Vinyl getVinyl() {
        return this.vinyl;
    }

    public String getVinylName() {
        return this.vinylName;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public String getImage() {
        return this.image;
    }

    public int getUnitPrice() {
        return this.unitPrice;
    }

    public int getDiscountPercentage() {
        return this.discountPercentage;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setVinyl(Vinyl vinyl) {
        this.vinyl = vinyl;
    }

    public void setVinylName(String vinylName) {
        this.vinylName = vinylName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setOriginalPrice(Integer originalPrice) {
        this.originalPrice = originalPrice;
    }

    public void setDiscountPercentage(int discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
