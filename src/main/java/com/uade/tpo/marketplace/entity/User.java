package com.uade.tpo.marketplace.entity;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM(\'USER\',\'ADMIN\')")
    private Role role;
    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Cart cart;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Favorite> favorites;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Order> orders;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Review> reviews;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public Long getId() {
        return id;
    }


    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private Role role;
        private Cart cart;
        private List<Favorite> favorites;
        private List<Order> orders;
        private List<Review> reviews;

        UserBuilder() {
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        /**
         * @return {@code this}.
         */
        public User.UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        /**
         * @return {@code this}.
         */
        @JsonIgnore
        public User.UserBuilder cart(Cart cart) {
            this.cart = cart;
            return this;
        }

        /**
         * @return {@code this}.
         */
        @JsonIgnore
        public User.UserBuilder favorites(List<Favorite> favorites) {
            this.favorites = favorites;
            return this;
        }

        /**
         * @return {@code this}.
         */
        @JsonIgnore
        public User.UserBuilder orders(List<Order> orders) {
            this.orders = orders;
            return this;
        }

        /**
         * @return {@code this}.
         */
        @JsonIgnore
        public User.UserBuilder reviews(List<Review> reviews) {
            this.reviews = reviews;
            return this;
        }

        public User build() {
            return new User(this.id, this.email, this.password, this.firstName, this.lastName, this.role, this.cart, this.favorites, this.orders, this.reviews);
        }

        @Override
        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", email=" + this.email + ", password=" + this.password + ", firstName=" + this.firstName + ", lastName=" + this.lastName + ", role=" + this.role + ", cart=" + this.cart + ", favorites=" + this.favorites + ", orders=" + this.orders + ", reviews=" + this.reviews + ")";
        }
    }

    public static User.UserBuilder builder() {
        return new User.UserBuilder();
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Role getRole() {
        return this.role;
    }

    public Cart getCart() {
        return this.cart;
    }

    public List<Favorite> getFavorites() {
        return this.favorites;
    }

    public List<Order> getOrders() {
        return this.orders;
    }

    public List<Review> getReviews() {
        return this.reviews;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public void setFavorites(List<Favorite> favorites) {
        this.favorites = favorites;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof User)) return false;
        User other = (User) o;
        if (!other.canEqual((Object) this)) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$email = this.getEmail();
        Object other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) return false;
        Object this$password = this.getPassword();
        Object other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) return false;
        Object this$firstName = this.getFirstName();
        Object other$firstName = other.getFirstName();
        if (this$firstName == null ? other$firstName != null : !this$firstName.equals(other$firstName)) return false;
        Object this$lastName = this.getLastName();
        Object other$lastName = other.getLastName();
        if (this$lastName == null ? other$lastName != null : !this$lastName.equals(other$lastName)) return false;
        Object this$role = this.getRole();
        Object other$role = other.getRole();
        if (this$role == null ? other$role != null : !this$role.equals(other$role)) return false;
        Object this$cart = this.getCart();
        Object other$cart = other.getCart();
        if (this$cart == null ? other$cart != null : !this$cart.equals(other$cart)) return false;
        Object this$favorites = this.getFavorites();
        Object other$favorites = other.getFavorites();
        if (this$favorites == null ? other$favorites != null : !this$favorites.equals(other$favorites)) return false;
        Object this$orders = this.getOrders();
        Object other$orders = other.getOrders();
        if (this$orders == null ? other$orders != null : !this$orders.equals(other$orders)) return false;
        Object this$reviews = this.getReviews();
        Object other$reviews = other.getReviews();
        if (this$reviews == null ? other$reviews != null : !this$reviews.equals(other$reviews)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $email = this.getEmail();
        result = result * PRIME + ($email == null ? 43 : $email.hashCode());
        Object $password = this.getPassword();
        result = result * PRIME + ($password == null ? 43 : $password.hashCode());
        Object $firstName = this.getFirstName();
        result = result * PRIME + ($firstName == null ? 43 : $firstName.hashCode());
        Object $lastName = this.getLastName();
        result = result * PRIME + ($lastName == null ? 43 : $lastName.hashCode());
        Object $role = this.getRole();
        result = result * PRIME + ($role == null ? 43 : $role.hashCode());
        Object $cart = this.getCart();
        result = result * PRIME + ($cart == null ? 43 : $cart.hashCode());
        Object $favorites = this.getFavorites();
        result = result * PRIME + ($favorites == null ? 43 : $favorites.hashCode());
        Object $orders = this.getOrders();
        result = result * PRIME + ($orders == null ? 43 : $orders.hashCode());
        Object $reviews = this.getReviews();
        result = result * PRIME + ($reviews == null ? 43 : $reviews.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "User(id=" + this.getId() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", firstName=" + this.getFirstName() + ", lastName=" + this.getLastName() + ", role=" + this.getRole() + ", cart=" + this.getCart() + ", favorites=" + this.getFavorites() + ", orders=" + this.getOrders() + ", reviews=" + this.getReviews() + ")";
    }

    public User() {
    }

    public User(Long id, String email, String password, String firstName, String lastName, Role role, Cart cart, List<Favorite> favorites, List<Order> orders, List<Review> reviews) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.cart = cart;
        this.favorites = favorites;
        this.orders = orders;
        this.reviews = reviews;
    }
}
