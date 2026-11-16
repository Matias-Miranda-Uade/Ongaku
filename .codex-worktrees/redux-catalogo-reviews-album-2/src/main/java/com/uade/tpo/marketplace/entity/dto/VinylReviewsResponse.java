package com.uade.tpo.marketplace.entity.dto;

import java.util.List;

/**
 * Bloque de reseñas de un producto, como en la ficha de detalle de un ecommerce.
 */
public class VinylReviewsResponse {
    private Long vinylId;
    private String vinylName;
    private int totalReviews;
    private double averageScore;
    private List<ReviewResponse> reviews;

    public VinylReviewsResponse() {
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public String getVinylName() {
        return this.vinylName;
    }

    public int getTotalReviews() {
        return this.totalReviews;
    }

    public double getAverageScore() {
        return this.averageScore;
    }

    public List<ReviewResponse> getReviews() {
        return this.reviews;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    public void setVinylName(String vinylName) {
        this.vinylName = vinylName;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof VinylReviewsResponse)) return false;
        VinylReviewsResponse other = (VinylReviewsResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getTotalReviews() != other.getTotalReviews()) return false;
        if (Double.compare(this.getAverageScore(), other.getAverageScore()) != 0) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        Object this$vinylName = this.getVinylName();
        Object other$vinylName = other.getVinylName();
        if (this$vinylName == null ? other$vinylName != null : !this$vinylName.equals(other$vinylName)) return false;
        Object this$reviews = this.getReviews();
        Object other$reviews = other.getReviews();
        if (this$reviews == null ? other$reviews != null : !this$reviews.equals(other$reviews)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof VinylReviewsResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getTotalReviews();
        long $averageScore = Double.doubleToLongBits(this.getAverageScore());
        result = result * PRIME + (int) ($averageScore >>> 32 ^ $averageScore);
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        Object $vinylName = this.getVinylName();
        result = result * PRIME + ($vinylName == null ? 43 : $vinylName.hashCode());
        Object $reviews = this.getReviews();
        result = result * PRIME + ($reviews == null ? 43 : $reviews.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "VinylReviewsResponse(vinylId=" + this.getVinylId() + ", vinylName=" + this.getVinylName() + ", totalReviews=" + this.getTotalReviews() + ", averageScore=" + this.getAverageScore() + ", reviews=" + this.getReviews() + ")";
    }
}
