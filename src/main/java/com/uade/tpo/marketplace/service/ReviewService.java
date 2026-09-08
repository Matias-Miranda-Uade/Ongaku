package com.uade.tpo.marketplace.service;

import java.util.List;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewUpdateRequest;
import com.uade.tpo.marketplace.entity.dto.VinylReviewsResponse;

public interface ReviewService {

    List<Review> getReviews();

    Review getReviewById(long reviewId);

    /** Reseñas de un producto con su promedio, para la ficha de detalle. */
    VinylReviewsResponse getVinylReviews(long vinylId);

    List<Review> getMyReviews(String requesterEmail);

    Review createReview(ReviewRequest request, String requesterEmail);

    Review updateReview(long reviewId, ReviewUpdateRequest request, String requesterEmail);

    void deleteReview(long reviewId, String requesterEmail);
}
