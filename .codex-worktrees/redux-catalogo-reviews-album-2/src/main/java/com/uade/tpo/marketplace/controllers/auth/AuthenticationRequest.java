package com.uade.tpo.marketplace.controllers.auth;

public class AuthenticationRequest {
    private String email;
    String password;


    public static class AuthenticationRequestBuilder {
        private String email;
        private String password;

        AuthenticationRequestBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public AuthenticationRequest.AuthenticationRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public AuthenticationRequest.AuthenticationRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public AuthenticationRequest build() {
            return new AuthenticationRequest(this.email, this.password);
        }

        @Override
        public String toString() {
            return "AuthenticationRequest.AuthenticationRequestBuilder(email=" + this.email + ", password=" + this.password + ")";
        }
    }

    public static AuthenticationRequest.AuthenticationRequestBuilder builder() {
        return new AuthenticationRequest.AuthenticationRequestBuilder();
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof AuthenticationRequest)) return false;
        AuthenticationRequest other = (AuthenticationRequest) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$email = this.getEmail();
        Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        Object this$password = this.getPassword();
        Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof AuthenticationRequest;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "AuthenticationRequest(email=" + this.getEmail() + ", password=" + this.getPassword() + ")";
    }

    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthenticationRequest() {
    }
}
