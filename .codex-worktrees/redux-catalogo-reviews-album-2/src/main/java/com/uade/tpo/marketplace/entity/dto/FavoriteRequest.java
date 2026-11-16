package com.uade.tpo.marketplace.entity.dto;

public class FavoriteRequest {
    private int userId;
    private int vinylId;

    public FavoriteRequest() {
    }

    public int getUserId() {
        return this.userId;
    }

    public int getVinylId() {
        return this.vinylId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setVinylId(int vinylId) {
        this.vinylId = vinylId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof FavoriteRequest)) return false;
        FavoriteRequest other = (FavoriteRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getUserId() != other.getUserId()) return false;
        if (this.getVinylId() != other.getVinylId()) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof FavoriteRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getUserId();
        result = result * PRIME + this.getVinylId();
        return result;
    }

    @Override
    public String toString() {
        return "FavoriteRequest(userId=" + this.getUserId() + ", vinylId=" + this.getVinylId() + ")";
    }
}
