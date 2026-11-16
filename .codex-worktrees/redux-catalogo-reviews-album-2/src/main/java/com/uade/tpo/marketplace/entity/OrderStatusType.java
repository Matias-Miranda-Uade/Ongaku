package com.uade.tpo.marketplace.entity;

import java.util.Arrays;

import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;

/**
 * Catalogo fijo de estados de una orden. Los ids coinciden con las filas de la
 * tabla order_status, que se garantizan al arrancar (ver OrderStatusSeeder).
 */
public enum OrderStatusType {
    PENDIENTE(1L, "La orden fue creada y espera el pago"),
    PAGADA(2L, "El pago fue aprobado"),
    ENVIADA(3L, "La orden fue despachada"),
    ENTREGADA(4L, "La orden fue entregada al comprador"),
    CANCELADA(5L, "La orden fue cancelada");

    private final long id;
    private final String description;

    OrderStatusType(long id, String description) {
        this.id = id;
        this.description = description;
    }

    public long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public static OrderStatusType fromId(Long id) {
        if (id == null) {
            throw new InvalidFieldException("orderStatusId", "es obligatorio");
        }
        return Arrays.stream(values()).filter(status -> status.id == id).findFirst()
                .orElseThrow(() -> new InvalidFieldException("orderStatusId",
                        "debe estar entre 1 y " + values().length));
    }

    public static OrderStatusType fromName(String name) {
        if (name == null || name.isBlank()) {
            throw new InvalidFieldException("status", "es obligatorio");
        }
        String normalized = name.trim().toUpperCase();
        return Arrays.stream(values()).filter(status -> status.name().equals(normalized)).findFirst()
                .orElseThrow(() -> new InvalidFieldException("status",
                        "debe ser uno de " + Arrays.toString(values())));
    }

    /** Una orden entregada o cancelada ya no admite cambios de estado. */
    public boolean isFinal() {
        return this == ENTREGADA || this == CANCELADA;
    }

    /** Flujo de vida de la orden tal como lo aplica un ecommerce. */
    public boolean canTransitionTo(OrderStatusType target) {
        return switch (this) {
            case PENDIENTE -> target == PAGADA || target == CANCELADA;
            case PAGADA -> target == ENVIADA || target == CANCELADA;
            case ENVIADA -> target == ENTREGADA;
            case ENTREGADA, CANCELADA -> false;
        };
    }
}
