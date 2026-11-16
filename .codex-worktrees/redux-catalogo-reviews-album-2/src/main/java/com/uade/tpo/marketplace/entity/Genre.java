package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @ManyToOne
    @JoinColumn(name = "vinyl_id")
    @JsonIgnore
    private Vinyl vinyl;

    public Genre() {
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public Vinyl getVinyl() {
        return this.vinyl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setVinyl(Vinyl vinyl) {
        this.vinyl = vinyl;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Genre)) return false;
        Genre other = (Genre) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$vinyl = this.getVinyl();
        Object other$vinyl = other.getVinyl();
        if (this$vinyl == null ? other$vinyl != null : !this$vinyl.equals(other$vinyl)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Genre;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $vinyl = this.getVinyl();
        result = result * PRIME + ($vinyl == null ? 43 : $vinyl.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Genre(id=" + this.getId() + ", name=" + this.getName() + ", vinyl=" + this.getVinyl() + ")";
    }
}
