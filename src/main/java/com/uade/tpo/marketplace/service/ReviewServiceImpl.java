package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.repository.ReviewRepository;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    public ReviewServiceImpl(ReviewRepository repository) { this.reviewRepository = repository; }
    public ArrayList<Review> getReviews() { return reviewRepository.getReviews(); }
    public Review getReviewById(int id) { return reviewRepository.getReviews().stream().filter(r -> r.getId() == id).findFirst().orElse(null); }
    public Review createReview(String entity) {
        String[] values = entity == null ? new String[0] : entity.split(",", 3);
        if (values.length < 3 || values[2].trim().isBlank()) throw new IllegalArgumentException("La reseña requiere usuario, vinilo y comentario");
        int userId = Integer.parseInt(values[0].trim()); int vinylId = Integer.parseInt(values[1].trim());
        if (userId <= 0 || vinylId <= 0) throw new IllegalArgumentException("Los identificadores deben ser positivos");
        Review review = Review.builder().id(reviewRepository.getReviews().stream().mapToLong(Review::getId).max().orElse(0) + 1).userId(userId).vinylId(vinylId).comment(values[2].trim()).build();
        reviewRepository.getReviews().add(review); return review;
    }
}