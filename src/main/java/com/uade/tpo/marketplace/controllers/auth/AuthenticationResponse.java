package com.uade.tpo.marketplace.controllers.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationResponse {
    @JsonProperty("access token")
    private String accessToken;


    public static class AuthenticationResponseBuilder {
        private String accessToken;

        AuthenticationResponseBuilder() {
        }

        /**
         * @return {@code this}.
         */
        @JsonProperty("access token")
        public AuthenticationResponse.AuthenticationResponseBuilder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(this.accessToken);
        }

        @Override
        public String toString() {
            return "AuthenticationResponse.AuthenticationResponseBuilder(accessToken=" + this.accessToken + ")";
        }
    }

    public static AuthenticationResponse.AuthenticationResponseBuilder builder() {
        return new AuthenticationResponse.AuthenticationResponseBuilder();
    }

    public String getAccessToken() {
        return this.accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AuthenticationResponse)) return false;
        AuthenticationResponse other = (AuthenticationResponse) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$accessToken = this.getAccessToken();
        Object other$accessToken = other.getAccessToken();
        if (this$accessToken == null ? other$accessToken != null : !this$accessToken.equals(other$accessToken)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AuthenticationResponse;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $accessToken = this.getAccessToken();
        result = result * PRIME + ($accessToken == null ? 43 : $accessToken.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AuthenticationResponse(accessToken=" + this.getAccessToken() + ")";
    }

    public AuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public AuthenticationResponse() {
    }
}
