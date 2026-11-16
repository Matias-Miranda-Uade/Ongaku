package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItemResponse> items;
    /**
     * Cantidad de productos distintos.
     */
    private int totalProducts;
    /**
     * Suma de las cantidades de cada linea.
     */
    private int totalUnits;
    /**
     * Importe total del carrito.
     */
    private int total;
    private boolean empty;

    public CartResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public List<CartItemResponse> getItems() {
        return this.items;
    }

    /**
     * Cantidad de productos distintos.
     */
    public int getTotalProducts() {
        return this.totalProducts;
    }

    /**
     * Suma de las cantidades de cada linea.
     */
    public int getTotalUnits() {
        return this.totalUnits;
    }

    /**
     * Importe total del carrito.
     */
    public int getTotal() {
        return this.total;
    }

    public boolean isEmpty() {
        return this.empty;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    /**
     * Cantidad de productos distintos.
     */
    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    /**
     * Suma de las cantidades de cada linea.
     */
    public void setTotalUnits(int totalUnits) {
        this.totalUnits = totalUnits;
    }

    /**
     * Importe total del carrito.
     */
    public void setTotal(int total) {
        this.total = total;
    }

    public void setEmpty(boolean empty) {
        this.empty = empty;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof CartResponse)) return false;
        CartResponse other = (CartResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getTotalProducts() != other.getTotalProducts()) return false;
        if (this.getTotalUnits() != other.getTotalUnits()) return false;
        if (this.getTotal() != other.getTotal()) return false;
        if (this.isEmpty() != other.isEmpty()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$userId = this.getUserId();
        Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        Object this$items = this.getItems();
        Object other$items = other.getItems();
        if (this$items == null ? other$items != null : !this$items.equals(other$items)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof CartResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getTotalProducts();
        result = result * PRIME + this.getTotalUnits();
        result = result * PRIME + this.getTotal();
        result = result * PRIME + (this.isEmpty() ? 79 : 97);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        Object $items = this.getItems();
        result = result * PRIME + ($items == null ? 43 : $items.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "CartResponse(id=" + this.getId() + ", userId=" + this.getUserId() + ", items=" + this.getItems() + ", totalProducts=" + this.getTotalProducts() + ", totalUnits=" + this.getTotalUnits() + ", total=" + this.getTotal() + ", empty=" + this.isEmpty() + ")";
    }
}
