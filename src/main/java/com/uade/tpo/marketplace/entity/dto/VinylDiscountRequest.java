package com.uade.tpo.marketplace.entity.dto;

public class VinylDiscountRequest {
    private Integer discountPercentage;

    public VinylDiscountRequest() {
    }

    public Integer getDiscountPercentage() {
        return this.discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof VinylDiscountRequest)) return false;
        VinylDiscountRequest other = (VinylDiscountRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$discountPercentage = this.getDiscountPercentage();
        Object other$discountPercentage = other.getDiscountPercentage();
        if (this$discountPercentage == null ? other$discountPercentage != null : !this$discountPercentage.equals(other$discountPercentage)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof VinylDiscountRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $discountPercentage = this.getDiscountPercentage();
        result = result * PRIME + ($discountPercentage == null ? 43 : $discountPercentage.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "VinylDiscountRequest(discountPercentage=" + this.getDiscountPercentage() + ")";
    }
}
