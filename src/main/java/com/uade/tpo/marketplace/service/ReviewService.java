package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Review;
import java.util.ArrayList;

public interface ReviewService {
    ArrayList<Review> getReviews();
    Review getReviewById(int reviewId);
    Review createReview(String entity);
}
