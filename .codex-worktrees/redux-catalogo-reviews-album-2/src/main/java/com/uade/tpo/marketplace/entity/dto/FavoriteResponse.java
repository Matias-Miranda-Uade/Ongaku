package com.uade.tpo.marketplace.entity.dto;

public class FavoriteResponse {
    private Long id;
    private Long userId;
    private Long vinylId;

    public FavoriteResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof FavoriteResponse)) return false;
        FavoriteResponse other = (FavoriteResponse) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$userId = this.getUserId();
        Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof FavoriteResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "FavoriteResponse(id=" + this.getId() + ", userId=" + this.getUserId() + ", vinylId=" + this.getVinylId() + ")";
    }
}
