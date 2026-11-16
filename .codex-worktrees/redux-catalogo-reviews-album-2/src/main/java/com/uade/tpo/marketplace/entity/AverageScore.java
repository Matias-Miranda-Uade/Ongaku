package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AverageScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "vinyl_id")
    private Vinyl vinyl;
    @Column
    private double averageScore;

    public AverageScore() {
    }

    public Long getId() {
        return this.id;
    }

    public Vinyl getVinyl() {
        return this.vinyl;
    }

    public double getAverageScore() {
        return this.averageScore;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setVinyl(Vinyl vinyl) {
        this.vinyl = vinyl;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AverageScore)) return false;
        AverageScore other = (AverageScore) o;
        if (!other.canEqual((Object) this)) return false;
        if (Double.compare(this.getAverageScore(), other.getAverageScore()) != 0) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$vinyl = this.getVinyl();
        Object other$vinyl = other.getVinyl();
        if (this$vinyl == null ? other$vinyl != null : !this$vinyl.equals(other$vinyl)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AverageScore;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        long $averageScore = Double.doubleToLongBits(this.getAverageScore());
        result = result * PRIME + (int) ($averageScore >>> 32 ^ $averageScore);
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $vinyl = this.getVinyl();
        result = result * PRIME + ($vinyl == null ? 43 : $vinyl.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AverageScore(id=" + this.getId() + ", vinyl=" + this.getVinyl() + ", averageScore=" + this.getAverageScore() + ")";
    }
}
