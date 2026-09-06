package com.uade.tpo.marketplace.service;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import java.util.ArrayList;

public interface ReviewService {
    ArrayList<Review> getReviews();
    Review getReviewById(int reviewId);
    Review createReview(ReviewRequest request, String requesterEmail);
}