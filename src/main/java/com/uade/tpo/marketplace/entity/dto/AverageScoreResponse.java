package com.uade.tpo.marketplace.entity.dto;

public class AverageScoreResponse {
    private Long id;
    private Long vinylId;
    private double averageScore;

    public Long getId() {
        return this.id;
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public double getAverageScore() {
        return this.averageScore;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AverageScoreResponse)) return false;
        AverageScoreResponse other = (AverageScoreResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (Double.compare(this.getAverageScore(), other.getAverageScore()) != 0) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AverageScoreResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        long $averageScore = Double.doubleToLongBits(this.getAverageScore());
        result = result * PRIME + (int) ($averageScore >>> 32 ^ $averageScore);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AverageScoreResponse(id=" + this.getId() + ", vinylId=" + this.getVinylId() + ", averageScore=" + this.getAverageScore() + ")";
    }

    public AverageScoreResponse(Long id, Long vinylId, double averageScore) {
        this.id = id;
        this.vinylId = vinylId;
        this.averageScore = averageScore;
    }

    public AverageScoreResponse() {
    }
}
