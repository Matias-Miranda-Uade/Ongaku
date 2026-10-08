package com.uade.tpo.marketplace.entity.dto;

public class AudioPreviewResponse {
    private Long id;
    private String url;
    private int durationSeconds;

    public AudioPreviewResponse() {
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AudioPreviewResponse)) return false;
        AudioPreviewResponse other = (AudioPreviewResponse) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getDurationSeconds() != other.getDurationSeconds()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$url = this.getUrl();
        Object other$url = other.getUrl();
        if (this$url == null ? other$url != null : !this$url.equals(other$url)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AudioPreviewResponse;
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
        return result;
    }

    @Override
    public String toString() {
        return "AudioPreviewResponse(id=" + this.getId() + ", url=" + this.getUrl() + ", durationSeconds=" + this.getDurationSeconds() + ")";
    }
}
