package com.uade.tpo.marketplace.entity;

import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Category {
    public Category() {
    }

    public Category(String description) {
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String description;
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Vinyl> vinyls;

    public Long getId() {
        return this.id;
    }

    public String getDescription() {
        return this.description;
    }

    public List<Vinyl> getVinyls() {
        return this.vinyls;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVinyls(List<Vinyl> vinyls) {
        this.vinyls = vinyls;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Category)) return false;
        Category other = (Category) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$description = this.getDescription();
        Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        Object this$vinyls = this.getVinyls();
        Object other$vinyls = other.getVinyls();
        if (this$vinyls == null ? other$vinyls != null : !this$vinyls.equals(other$vinyls)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Category;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        Object $vinyls = this.getVinyls();
        result = result * PRIME + ($vinyls == null ? 43 : $vinyls.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Category(id=" + this.getId() + ", description=" + this.getDescription() + ", vinyls=" + this.getVinyls() + ")";
    }
}
