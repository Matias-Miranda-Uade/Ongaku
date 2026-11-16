package com.uade.tpo.marketplace.entity.dto.mapper;

import java.util.List;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;
import com.uade.tpo.marketplace.entity.dto.VinylReviewsResponse;

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
        response.setUserName(review.getUser() != null ? review.getUser().getFullName() : null);
        response.setVinylId(review.getVinyl() != null ? review.getVinyl().getId() : null);
        response.setVinylName(review.getVinyl() != null ? review.getVinyl().getName() : null);
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        response.setEdited(review.getCreatedAt() != null && review.getUpdatedAt() != null
                && review.getUpdatedAt().isAfter(review.getCreatedAt()));
        return response;
    }

    public static VinylReviewsResponse toVinylReviews(Vinyl vinyl, List<Review> reviews) {
        VinylReviewsResponse response = new VinylReviewsResponse();
        response.setVinylId(vinyl.getId());
        response.setVinylName(vinyl.getName());
        response.setReviews(reviews.stream().map(ReviewMapper::toResponse).toList());
        response.setTotalReviews(reviews.size());
        double average = reviews.stream().filter(review -> review.getScore() != null)
                .mapToInt(Review::getScore).average().orElse(0);
        response.setAverageScore(Math.round(average * 100) / 100.0);
        return response;
    }
}
