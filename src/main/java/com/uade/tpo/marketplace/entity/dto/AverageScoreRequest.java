package com.uade.tpo.marketplace.entity.dto;

public class AverageScoreRequest {
    private int vinylId;
    private double averageScore;

    public AverageScoreRequest() {
    }

    public int getVinylId() {
        return this.vinylId;
    }

    public double getAverageScore() {
        return this.averageScore;
    }

    public void setVinylId(int vinylId) {
        this.vinylId = vinylId;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AverageScoreRequest)) return false;
        AverageScoreRequest other = (AverageScoreRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getVinylId() != other.getVinylId()) return false;
        if (Double.compare(this.getAverageScore(), other.getAverageScore()) != 0) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AverageScoreRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getVinylId();
        long $averageScore = Double.doubleToLongBits(this.getAverageScore());
        result = result * PRIME + (int) ($averageScore >>> 32 ^ $averageScore);
        return result;
    }

    @Override
    public String toString() {
        return "AverageScoreRequest(vinylId=" + this.getVinylId() + ", averageScore=" + this.getAverageScore() + ")";
    }
}
