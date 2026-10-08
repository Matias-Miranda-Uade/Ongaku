package com.uade.tpo.marketplace.entity.dto;

public class VinylPreviewResponse {
    private Long id;
    private String name;
    private String image;
    private int price;
    private int originalPrice;
    private int discountPercentage;
    private int discountAmount;
    private int finalPrice;
    private int year;
    private String artistName;
    private String categoryDescription;

    public VinylPreviewResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getImage() {
        return this.image;
    }

    public int getPrice() {
        return this.price;
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

    public int getYear() {
        return this.year;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public String getCategoryDescription() {
        return this.categoryDescription;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setPrice(int price) {
        this.price = price;
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

    public void setYear(int year) {
        this.year = year;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof VinylPreviewResponse)) return false;
        VinylPreviewResponse other = (VinylPreviewResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getPrice() != other.getPrice()) return false;
        if (this.getOriginalPrice() != other.getOriginalPrice()) return false;
        if (this.getDiscountPercentage() != other.getDiscountPercentage()) return false;
        if (this.getDiscountAmount() != other.getDiscountAmount()) return false;
        if (this.getFinalPrice() != other.getFinalPrice()) return false;
        if (this.getYear() != other.getYear()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$image = this.getImage();
        Object other$image = other.getImage();
        if (this$image == null ? other$image != null : !this$image.equals(other$image)) return false;
        Object this$artistName = this.getArtistName();
        Object other$artistName = other.getArtistName();
        if (this$artistName == null ? other$artistName != null : !this$artistName.equals(other$artistName)) return false;
        Object this$categoryDescription = this.getCategoryDescription();
        Object other$categoryDescription = other.getCategoryDescription();
        if (this$categoryDescription == null ? other$categoryDescription != null : !this$categoryDescription.equals(other$categoryDescription)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof VinylPreviewResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getPrice();
        result = result * PRIME + this.getOriginalPrice();
        result = result * PRIME + this.getDiscountPercentage();
        result = result * PRIME + this.getDiscountAmount();
        result = result * PRIME + this.getFinalPrice();
        result = result * PRIME + this.getYear();
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $image = this.getImage();
        result = result * PRIME + ($image == null ? 43 : $image.hashCode());
        Object $artistName = this.getArtistName();
        result = result * PRIME + ($artistName == null ? 43 : $artistName.hashCode());
        Object $categoryDescription = this.getCategoryDescription();
        result = result * PRIME + ($categoryDescription == null ? 43 : $categoryDescription.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "VinylPreviewResponse(id=" + this.getId() + ", name=" + this.getName() + ", image=" + this.getImage() + ", price=" + this.getPrice() + ", originalPrice=" + this.getOriginalPrice() + ", discountPercentage=" + this.getDiscountPercentage() + ", discountAmount=" + this.getDiscountAmount() + ", finalPrice=" + this.getFinalPrice() + ", year=" + this.getYear() + ", artistName=" + this.getArtistName() + ", categoryDescription=" + this.getCategoryDescription() + ")";
    }
}
