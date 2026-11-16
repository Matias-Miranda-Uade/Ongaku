package com.uade.tpo.marketplace.entity.dto;

public class AudioPreviewRequest {
    private String url;
    private int durationSeconds;

    public AudioPreviewRequest() {
    }

    public String getUrl() {
        return this.url;
    }

    public int getDurationSeconds() {
        return this.durationSeconds;
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
        if (!(o instanceof AudioPreviewRequest)) return false;
        AudioPreviewRequest other = (AudioPreviewRequest) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getDurationSeconds() != other.getDurationSeconds()) return false;
        Object this$url = this.getUrl();
        Object other$url = other.getUrl();
        if (this$url == null ? other$url != null : !this$url.equals(other$url)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AudioPreviewRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getDurationSeconds();
        Object $url = this.getUrl();
        result = result * PRIME + ($url == null ? 43 : $url.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AudioPreviewRequest(url=" + this.getUrl() + ", durationSeconds=" + this.getDurationSeconds() + ")";
    }
}
