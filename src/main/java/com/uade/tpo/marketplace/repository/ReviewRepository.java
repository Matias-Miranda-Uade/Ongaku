package com.uade.tpo.marketplace.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.marketplace.entity.Review;
import org.springframework.stereotype.Repository;

@Repository
public class ReviewRepository {
    public ArrayList<Review> reviews = new ArrayList<>(Arrays.asList(
            Review.builder().id(1).userId(1).vinylId(10).comment("Muy bueno").build(),
            Review.builder().id(2).userId(2).vinylId(11).comment("Excelente calidad").build(),
            Review.builder().id(3).userId(3).vinylId(12).comment("Me gustó mucho").build()
    ));

    public ArrayList<Review> getReviews() {
        return this.reviews;
    }

    public Review getReviewById(int reviewId) {
        return null;
    }

    public Review createReview(String entity) {
        return null;
    }
}
