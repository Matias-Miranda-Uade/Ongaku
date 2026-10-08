package com.uade.tpo.marketplace.entity.dto;

public class VinylResponse {
    private Long id;
    private String name;
    private String description;
    private int price;
    private int originalPrice;
    private int discountPercentage;
    private int discountAmount;
    private int finalPrice;
    private int stock;
    private String image;
    private Long categoryId;
    private Long artistId;
    private Long genreId;
    private Long audioPreviewId;
    private int year;

    public VinylResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
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

    public int getStock() {
        return this.stock;
    }

    public String getImage() {
        return this.image;
    }

    public Long getCategoryId() {
        return this.categoryId;
    }

    public Long getArtistId() {
        return this.artistId;
    }

    public Long getGenreId() {
        return this.genreId;
    }

    public Long getAudioPreviewId() {
        return this.audioPreviewId;
    }

    public int getYear() {
        return this.year;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public void setGenreId(Long genreId) {
        this.genreId = genreId;
    }

    public void setAudioPreviewId(Long audioPreviewId) {
        this.audioPreviewId = audioPreviewId;
    }

    public void setYear(int year) {
        this.year = year;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof VinylResponse)) return false;
        VinylResponse other = (VinylResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getPrice() != other.getPrice()) return false;
        if (this.getOriginalPrice() != other.getOriginalPrice()) return false;
        if (this.getDiscountPercentage() != other.getDiscountPercentage()) return false;
        if (this.getDiscountAmount() != other.getDiscountAmount()) return false;
        if (this.getFinalPrice() != other.getFinalPrice()) return false;
        if (this.getStock() != other.getStock()) return false;
        if (this.getYear() != other.getYear()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$categoryId = this.getCategoryId();
        Object other$categoryId = other.getCategoryId();
        if (this$categoryId == null ? other$categoryId != null : !this$categoryId.equals(other$categoryId)) return false;
        Object this$artistId = this.getArtistId();
        Object other$artistId = other.getArtistId();
        if (this$artistId == null ? other$artistId != null : !this$artistId.equals(other$artistId)) return false;
        Object this$genreId = this.getGenreId();
        Object other$genreId = other.getGenreId();
        if (this$genreId == null ? other$genreId != null : !this$genreId.equals(other$genreId)) return false;
        Object this$audioPreviewId = this.getAudioPreviewId();
        Object other$audioPreviewId = other.getAudioPreviewId();
        if (this$audioPreviewId == null ? other$audioPreviewId != null : !this$audioPreviewId.equals(other$audioPreviewId)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$description = this.getDescription();
        Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        Object this$image = this.getImage();
        Object other$image = other.getImage();
        if (this$image == null ? other$image != null : !this$image.equals(other$image)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof VinylResponse;
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
        result = result * PRIME + this.getStock();
        result = result * PRIME + this.getYear();
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $categoryId = this.getCategoryId();
        result = result * PRIME + ($categoryId == null ? 43 : $categoryId.hashCode());
        Object $artistId = this.getArtistId();
        result = result * PRIME + ($artistId == null ? 43 : $artistId.hashCode());
        Object $genreId = this.getGenreId();
        result = result * PRIME + ($genreId == null ? 43 : $genreId.hashCode());
        Object $audioPreviewId = this.getAudioPreviewId();
        result = result * PRIME + ($audioPreviewId == null ? 43 : $audioPreviewId.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        Object $image = this.getImage();
        result = result * PRIME + ($image == null ? 43 : $image.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "VinylResponse(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", price=" + this.getPrice() + ", originalPrice=" + this.getOriginalPrice() + ", discountPercentage=" + this.getDiscountPercentage() + ", discountAmount=" + this.getDiscountAmount() + ", finalPrice=" + this.getFinalPrice() + ", stock=" + this.getStock() + ", image=" + this.getImage() + ", categoryId=" + this.getCategoryId() + ", artistId=" + this.getArtistId() + ", genreId=" + this.getGenreId() + ", audioPreviewId=" + this.getAudioPreviewId() + ", year=" + this.getYear() + ")";
    }
}
