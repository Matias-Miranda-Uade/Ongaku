package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.repository.ReviewRepository;

public class ReviewService {
    
    public ArrayList<Review> getReviews() {
        ReviewRepository reviewRepository = new ReviewRepository();
        return reviewRepository.getReviews();
    }

    public Review getReviewById(int reviewId) {
        ReviewRepository reviewRepository = new ReviewRepository();
        return reviewRepository.getReviewById(reviewId);
    }

    public Review createReview(String entity) {
        ReviewRepository reviewRepository = new ReviewRepository();
        return reviewRepository.createReview(entity);
    }
}
