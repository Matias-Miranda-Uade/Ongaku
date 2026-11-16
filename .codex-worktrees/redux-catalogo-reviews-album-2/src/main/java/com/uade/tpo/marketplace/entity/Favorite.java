package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "vinyl_id")
    private Vinyl vinyl;

    public Favorite() {
    }

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public Vinyl getVinyl() {
        return this.vinyl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setVinyl(Vinyl vinyl) {
        this.vinyl = vinyl;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Favorite)) return false;
        Favorite other = (Favorite) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$user = this.getUser();
        Object other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) return false;
        Object this$vinyl = this.getVinyl();
        Object other$vinyl = other.getVinyl();
        if (this$vinyl == null ? other$vinyl != null : !this$vinyl.equals(other$vinyl)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Favorite;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $user = this.getUser();
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        Object $vinyl = this.getVinyl();
        result = result * PRIME + ($vinyl == null ? 43 : $vinyl.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Favorite(id=" + this.getId() + ", user=" + this.getUser() + ", vinyl=" + this.getVinyl() + ")";
    }
}
