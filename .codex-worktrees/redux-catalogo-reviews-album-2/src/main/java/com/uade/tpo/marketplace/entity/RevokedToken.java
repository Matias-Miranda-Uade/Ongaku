package com.uade.tpo.marketplace.entity;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RevokedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;
    @Column(nullable = false)
    private Instant expiresAt;


    public static class RevokedTokenBuilder {
        private Long id;
        private String tokenHash;
        private Instant expiresAt;

        RevokedTokenBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public RevokedToken.RevokedTokenBuilder id(Long id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public RevokedToken.RevokedTokenBuilder tokenHash(String tokenHash) {
            this.tokenHash = tokenHash;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public RevokedToken.RevokedTokenBuilder expiresAt(Instant expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public RevokedToken build() {
            return new RevokedToken(this.id, this.tokenHash, this.expiresAt);
        }

        @Override
        public String toString() {
            return "RevokedToken.RevokedTokenBuilder(id=" + this.id + ", tokenHash=" + this.tokenHash + ", expiresAt=" + this.expiresAt + ")";
        }
    }

    public static RevokedToken.RevokedTokenBuilder builder() {
        return new RevokedToken.RevokedTokenBuilder();
    }

    public Long getId() {
        return this.id;
    }

    public String getTokenHash() {
        return this.tokenHash;
    }

    public Instant getExpiresAt() {
        return this.expiresAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof RevokedToken)) return false;
        RevokedToken other = (RevokedToken) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$tokenHash = this.getTokenHash();
        Object other$tokenHash = other.getTokenHash();
        if (this$tokenHash == null ? other$tokenHash != null : !this$tokenHash.equals(other$tokenHash)) return false;
        Object this$expiresAt = this.getExpiresAt();
        Object other$expiresAt = other.getExpiresAt();
        if (this$expiresAt == null ? other$expiresAt != null : !this$expiresAt.equals(other$expiresAt)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof RevokedToken;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $tokenHash = this.getTokenHash();
        result = result * PRIME + ($tokenHash == null ? 43 : $tokenHash.hashCode());
        Object $expiresAt = this.getExpiresAt();
        result = result * PRIME + ($expiresAt == null ? 43 : $expiresAt.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "RevokedToken(id=" + this.getId() + ", tokenHash=" + this.getTokenHash() + ", expiresAt=" + this.getExpiresAt() + ")";
    }

    public RevokedToken() {
    }

    public RevokedToken(Long id, String tokenHash, Instant expiresAt) {
        this.id = id;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }
}
