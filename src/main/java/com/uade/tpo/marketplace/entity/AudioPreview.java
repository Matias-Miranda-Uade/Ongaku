package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class AudioPreview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String url;
    @Column
    private int durationSeconds;
    @OneToOne(mappedBy = "audioPreview")
    @JsonIgnore
    private Vinyl vinyl;

    public AudioPreview() {
    }

    public Long getId() {
        return this.id;
    }

    public String getUrl() {
        return this.url;
    }

    public int getDurationSeconds() {
        return this.durationSeconds;
    }

    public Vinyl getVinyl() {
        return this.vinyl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public void setVinyl(Vinyl vinyl) {
        this.vinyl = vinyl;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AudioPreview)) return false;
        AudioPreview other = (AudioPreview) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getDurationSeconds() != other.getDurationSeconds()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$url = this.getUrl();
        Object other$url = other.getUrl();
        if (this$url == null ? other$url != null : !this$url.equals(other$url)) return false;
        Object this$vinyl = this.getVinyl();
        Object other$vinyl = other.getVinyl();
        if (this$vinyl == null ? other$vinyl != null : !this$vinyl.equals(other$vinyl)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AudioPreview;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getDurationSeconds();
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $url = this.getUrl();
        result = result * PRIME + ($url == null ? 43 : $url.hashCode());
        Object $vinyl = this.getVinyl();
        result = result * PRIME + ($vinyl == null ? 43 : $vinyl.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AudioPreview(id=" + this.getId() + ", url=" + this.getUrl() + ", durationSeconds=" + this.getDurationSeconds() + ", vinyl=" + this.getVinyl() + ")";
    }
}
