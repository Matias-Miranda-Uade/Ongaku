package com.uade.tpo.marketplace.entity.dto.mapper;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;

public final class ReviewMapper {
    private ReviewMapper() {
    }

    public static ReviewResponse toResponse(Review review) {
        if (review == null) return null;
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setComment(review.getComment());
        response.setScore(review.getScore());
        response.setUserId(review.getUser() != null ? review.getUser().getId() : null);
        response.setUserName(review.getUser() != null ? review.getUser().getName() : null);
        response.setVinylId(review.getVinyl() != null ? review.getVinyl().getId() : null);
        return response;
    }
}
