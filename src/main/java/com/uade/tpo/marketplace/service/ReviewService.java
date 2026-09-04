package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;

public interface ReviewService {
    ArrayList<ReviewResponse> getReviewsByVinyl(int vinylId);
    ReviewResponse getReviewById(int reviewId);
    ReviewResponse createReview(String email, ReviewRequest request);
    ReviewResponse updateReview(String email, int reviewId, ReviewRequest request);
    boolean deleteReview(String email, int reviewId);
}
