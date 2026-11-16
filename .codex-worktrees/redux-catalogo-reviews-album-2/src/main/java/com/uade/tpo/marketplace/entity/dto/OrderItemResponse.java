package com.uade.tpo.marketplace.entity.dto;

/**
 * Linea de la orden con los datos congelados al momento de la compra.
 */
public class OrderItemResponse {
    private Long vinylId;
    private String name;
    private String artistName;
    private String image;
    private int unitPrice;
    private int originalPrice;
    private int discountPercentage;
    private int discountAmount;
    private int finalPrice;
    private int quantity;
    private int subtotal;

    public OrderItemResponse() {
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public String getName() {
        return this.name;
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

    public int getOriginalPrice() {
        return this.originalPrice;
    }

    public int getDiscountPercentage() {
        return this.discountPercentage;
    }

    public int getDiscountAmount() {
        return this.discountAmount;
    }

    public int getFinalPrice() {
        return this.finalPrice;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public int getSubtotal() {
        return this.subtotal;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    public void setName(String name) {
        this.name = name;
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

    public void setOriginalPrice(int originalPrice) {
        this.originalPrice = originalPrice;
    }

    public void setDiscountPercentage(int discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setDiscountAmount(int discountAmount) {
        this.discountAmount = discountAmount;
    }

    public void setFinalPrice(int finalPrice) {
        this.finalPrice = finalPrice;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setSubtotal(int subtotal) {
        this.subtotal = subtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof OrderItemResponse)) return false;
        OrderItemResponse other = (OrderItemResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getUnitPrice() != other.getUnitPrice()) return false;
        if (this.getOriginalPrice() != other.getOriginalPrice()) return false;
        if (this.getDiscountPercentage() != other.getDiscountPercentage()) return false;
        if (this.getDiscountAmount() != other.getDiscountAmount()) return false;
        if (this.getFinalPrice() != other.getFinalPrice()) return false;
        if (this.getQuantity() != other.getQuantity()) return false;
        if (this.getSubtotal() != other.getSubtotal()) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$artistName = this.getArtistName();
        Object other$artistName = other.getArtistName();
        if (this$artistName == null ? other$artistName != null : !this$artistName.equals(other$artistName)) return false;
        Object this$image = this.getImage();
        Object other$image = other.getImage();
        if (this$image == null ? other$image != null : !this$image.equals(other$image)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderItemResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getUnitPrice();
        result = result * PRIME + this.getOriginalPrice();
        result = result * PRIME + this.getDiscountPercentage();
        result = result * PRIME + this.getDiscountAmount();
        result = result * PRIME + this.getFinalPrice();
        result = result * PRIME + this.getQuantity();
        result = result * PRIME + this.getSubtotal();
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $artistName = this.getArtistName();
        result = result * PRIME + ($artistName == null ? 43 : $artistName.hashCode());
        Object $image = this.getImage();
        result = result * PRIME + ($image == null ? 43 : $image.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "OrderItemResponse(vinylId=" + this.getVinylId() + ", name=" + this.getName() + ", artistName=" + this.getArtistName() + ", image=" + this.getImage() + ", unitPrice=" + this.getUnitPrice() + ", originalPrice=" + this.getOriginalPrice() + ", discountPercentage=" + this.getDiscountPercentage() + ", discountAmount=" + this.getDiscountAmount() + ", finalPrice=" + this.getFinalPrice() + ", quantity=" + this.getQuantity() + ", subtotal=" + this.getSubtotal() + ")";
    }
}
