package com.uade.tpo.marketplace.entity;

import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Vinyl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @Column
    private String description;
    @Column
    private int price;
    @Column(nullable = false, columnDefinition = "integer default 0")
    private int discountPercentage = 0;

    public int getFinalPrice() {
        return (int) (((long) price * (100 - discountPercentage) + 50) / 100);
    }

    public int getDiscountAmount() {
        return price - getFinalPrice();
    }

    @Column
    private int stock;
    @Column
    private Boolean enabled = true;
    @Column
    private String image;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;
    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre;
    @OneToOne
    @JoinColumn(name = "audio_preview_id")
    private AudioPreview audioPreview;
    @Column
    private int year;
    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<Review> reviews;
    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<AverageScore> averageScores;
    @OneToMany(mappedBy = "vinyl")
    @JsonIgnore
    private List<Favorite> favorites;

    public Vinyl() {
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public int getPrice() {
        return this.price;
    }

    public int getDiscountPercentage() {
        return this.discountPercentage;
    }

    public int getStock() {
        return this.stock;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public String getImage() {
        return this.image;
    }

    public Category getCategory() {
        return this.category;
    }

    public Artist getArtist() {
        return this.artist;
    }

    public Genre getGenre() {
        return this.genre;
    }

    public AudioPreview getAudioPreview() {
        return this.audioPreview;
    }

    public int getYear() {
        return this.year;
    }

    public List<Review> getReviews() {
        return this.reviews;
    }

    public List<AverageScore> getAverageScores() {
        return this.averageScores;
    }

    public List<Favorite> getFavorites() {
        return this.favorites;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public void setDiscountPercentage(int discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public void setAudioPreview(AudioPreview audioPreview) {
        this.audioPreview = audioPreview;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public void setAverageScores(List<AverageScore> averageScores) {
        this.averageScores = averageScores;
    }

    public void setFavorites(List<Favorite> favorites) {
        this.favorites = favorites;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Vinyl)) return false;
        Vinyl other = (Vinyl) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getPrice() != other.getPrice()) return false;
        if (this.getDiscountPercentage() != other.getDiscountPercentage()) return false;
        if (this.getStock() != other.getStock()) return false;
        if (this.getYear() != other.getYear()) return false;
        Object this$id = this.getId();
        Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        Object this$enabled = this.getEnabled();
        Object other$enabled = other.getEnabled();
        if (this$enabled == null ? other$enabled != null : !this$enabled.equals(other$enabled)) return false;
        Object this$name = this.getName();
        Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        Object this$description = this.getDescription();
        Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description)) return false;
        Object this$image = this.getImage();
        Object other$image = other.getImage();
        if (this$image == null ? other$image != null : !this$image.equals(other$image)) return false;
        Object this$category = this.getCategory();
        Object other$category = other.getCategory();
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) return false;
        Object this$artist = this.getArtist();
        Object other$artist = other.getArtist();
        if (this$artist == null ? other$artist != null : !this$artist.equals(other$artist)) return false;
        Object this$genre = this.getGenre();
        Object other$genre = other.getGenre();
        if (this$genre == null ? other$genre != null : !this$genre.equals(other$genre)) return false;
        Object this$audioPreview = this.getAudioPreview();
        Object other$audioPreview = other.getAudioPreview();
        if (this$audioPreview == null ? other$audioPreview != null : !this$audioPreview.equals(other$audioPreview)) return false;
        Object this$reviews = this.getReviews();
        Object other$reviews = other.getReviews();
        if (this$reviews == null ? other$reviews != null : !this$reviews.equals(other$reviews)) return false;
        Object this$averageScores = this.getAverageScores();
        Object other$averageScores = other.getAverageScores();
        if (this$averageScores == null ? other$averageScores != null : !this$averageScores.equals(other$averageScores)) return false;
        Object this$favorites = this.getFavorites();
        Object other$favorites = other.getFavorites();
        if (this$favorites == null ? other$favorites != null : !this$favorites.equals(other$favorites)) return false;
        return true;
    }

    protected boolean canEqual(Object other) {
        return other instanceof Vinyl;
    }

    @Override
    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * PRIME + this.getPrice();
        result = result * PRIME + this.getDiscountPercentage();
        result = result * PRIME + this.getStock();
        result = result * PRIME + this.getYear();
        Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        Object $enabled = this.getEnabled();
        result = result * PRIME + ($enabled == null ? 43 : $enabled.hashCode());
        Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        Object $image = this.getImage();
        result = result * PRIME + ($image == null ? 43 : $image.hashCode());
        Object $category = this.getCategory();
        result = result * PRIME + ($category == null ? 43 : $category.hashCode());
        Object $artist = this.getArtist();
        result = result * PRIME + ($artist == null ? 43 : $artist.hashCode());
        Object $genre = this.getGenre();
        result = result * PRIME + ($genre == null ? 43 : $genre.hashCode());
        Object $audioPreview = this.getAudioPreview();
        result = result * PRIME + ($audioPreview == null ? 43 : $audioPreview.hashCode());
        Object $reviews = this.getReviews();
        result = result * PRIME + ($reviews == null ? 43 : $reviews.hashCode());
        Object $averageScores = this.getAverageScores();
        result = result * PRIME + ($averageScores == null ? 43 : $averageScores.hashCode());
        Object $favorites = this.getFavorites();
        result = result * PRIME + ($favorites == null ? 43 : $favorites.hashCode());
        return result;
    }

    @Override
    public String toString() {
        return "Vinyl(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ", price=" + this.getPrice() + ", discountPercentage=" + this.getDiscountPercentage() + ", stock=" + this.getStock() + ", enabled=" + this.getEnabled() + ", image=" + this.getImage() + ", category=" + this.getCategory() + ", artist=" + this.getArtist() + ", genre=" + this.getGenre() + ", audioPreview=" + this.getAudioPreview() + ", year=" + this.getYear() + ", reviews=" + this.getReviews() + ", averageScores=" + this.getAverageScores() + ", favorites=" + this.getFavorites() + ")";
    }
}
