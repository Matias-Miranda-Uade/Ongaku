package com.uade.tpo.marketplace.entity.dto;

public class AdminVinylResponse extends VinylResponse {
    private boolean enabled;

    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
