package com.uade.tpo.marketplace.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.Setter;

/** Carrito del usuario. Se crea vacio al registrarse y hay exactamente uno por usuario. */
@Getter
@Setter
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    @JsonIgnore
    private List<CartItem> items = new ArrayList<>();

    public Optional<CartItem> findItem(Long vinylId) {
        return items.stream()
                .filter(item -> item.getVinyl() != null && item.getVinyl().getId().equals(vinylId))
                .findFirst();
    }

    public CartItem addItem(Vinyl vinyl, int quantity) {
        CartItem item = new CartItem(this, vinyl, quantity);
        items.add(item);
        return item;
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }

    public void clear() {
        items.forEach(item -> item.setCart(null));
        items.clear();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    /** Cantidad de lineas distintas (productos) del carrito. */
    public int getTotalProducts() {
        return items.size();
    }

    /** Cantidad total de unidades sumando las cantidades de cada linea. */
    public int getTotalUnits() {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }

    public int getTotal() {
        return items.stream().mapToInt(CartItem::getSubtotal).sum();
    }
}
