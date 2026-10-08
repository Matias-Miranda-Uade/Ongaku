package com.uade.tpo.marketplace.entity.dto;

public class GenreResponse {
    private Long id;
    private String name;
    private Long vinylId;

    public GenreResponse() {
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public Long getVinylId() {
        return this.vinylId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setVinylId(Long vinylId) {
        this.vinylId = vinylId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof GenreResponse)) return false;
        GenreResponse other = (GenreResponse) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$vinylId = this.getVinylId();
        Object other$vinylId = other.getVinylId();
        if (this$vinylId == null ? other$vinylId != null : !this$vinylId.equals(other$vinylId)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof GenreResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $vinylId = this.getVinylId();
        result = result * PRIME + ($vinylId == null ? 43 : $vinylId.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "GenreResponse(id=" + this.getId() + ", name=" + this.getName() + ", vinylId=" + this.getVinylId() + ")";
    }
}
