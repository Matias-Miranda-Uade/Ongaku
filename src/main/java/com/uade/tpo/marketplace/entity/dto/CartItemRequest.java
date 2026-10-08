package com.uade.tpo.marketplace.entity.dto;

public class CartItemRequest {
    private int vinylId;
    private int quantity = 1;

    public CartItemRequest() {
    }

    public int getVinylId() {
        return this.vinylId;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setVinylId(int vinylId) {
        this.vinylId = vinylId;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof CartItemRequest)) return false;
        CartItemRequest other = (CartItemRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getVinylId() != other.getVinylId()) return false;
        if (this.getQuantity() != other.getQuantity()) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof CartItemRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getVinylId();
        result = result * PRIME + this.getQuantity();
        return result;
    }

    @Override
    public String toString() {
        return "CartItemRequest(vinylId=" + this.getVinylId() + ", quantity=" + this.getQuantity() + ")";
    }
}
