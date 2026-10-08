package com.uade.tpo.marketplace.entity.dto;

public class OrderStatusResponse {
    private Long id;
    private String name;
    private String description;

    public OrderStatusResponse() {
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof OrderStatusResponse)) return false;
        OrderStatusResponse other = (OrderStatusResponse) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$description = this.getDescription();
        Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderStatusResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "OrderStatusResponse(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ")";
    }
}
