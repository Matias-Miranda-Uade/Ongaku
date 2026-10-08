package com.uade.tpo.marketplace.entity.dto;

public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;

    public ChangePasswordRequest() {
    }

    public String getCurrentPassword() {
        return this.currentPassword;
    }

    public String getNewPassword() {
        return this.newPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof ChangePasswordRequest)) return false;
        ChangePasswordRequest other = (ChangePasswordRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$currentPassword = this.getCurrentPassword();
        Object other$currentPassword = other.getCurrentPassword();
        if (this$currentPassword == null ? other$currentPassword != null : !this$currentPassword.equals(other$currentPassword)) return false;
        Object this$newPassword = this.getNewPassword();
        Object other$newPassword = other.getNewPassword();
        if (this$newPassword == null ? other$newPassword != null : !this$newPassword.equals(other$newPassword)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof ChangePasswordRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $currentPassword = this.getCurrentPassword();
        result = result * PRIME + ($currentPassword == null ? 43 : $currentPassword.hashCode());
        Object $newPassword = this.getNewPassword();
        result = result * PRIME + ($newPassword == null ? 43 : $newPassword.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "ChangePasswordRequest(currentPassword=" + this.getCurrentPassword() + ", newPassword=" + this.getNewPassword() + ")";
    }
}
