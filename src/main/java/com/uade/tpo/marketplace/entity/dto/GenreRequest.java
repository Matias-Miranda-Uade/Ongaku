package com.uade.tpo.marketplace.entity.dto;

public class GenreRequest {
    private String name;

    public GenreRequest() {
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof GenreRequest)) return false;
        GenreRequest other = (GenreRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof GenreRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "GenreRequest(name=" + this.getName() + ")";
    }
}
