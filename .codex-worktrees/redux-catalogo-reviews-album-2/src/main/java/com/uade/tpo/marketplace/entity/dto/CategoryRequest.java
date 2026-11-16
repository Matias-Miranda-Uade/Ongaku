package com.uade.tpo.marketplace.entity.dto;

public class CategoryRequest {
    private String description;

    public CategoryRequest() {
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof CategoryRequest)) return false;
        CategoryRequest other = (CategoryRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$description = this.getDescription();
        Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof CategoryRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "CategoryRequest(description=" + this.getDescription() + ")";
    }
}
