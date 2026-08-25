package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.repository.ReviewRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(
            ReviewRepository repository) {

        this.reviewRepository = repository;
    }

    @Override
    public ArrayList<Review> getReviews() {
        return new ArrayList<>(
            reviewRepository.findAll()
        );
    }

    @Override
    public Review getReviewById(int id) {
        return reviewRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Review createReview(
            String entity) {

        String[] values =
                entity == null
                ? new String[0]
                : entity.split(",", 3);

        if (values.length < 3 ||
            values[2].trim().isBlank()) {

            throw new IllegalArgumentException(
                "La reseña requiere usuario, vinilo y comentario"
            );
        }

        int userId =
                Integer.parseInt(values[0].trim());

        int vinylId =
                Integer.parseInt(values[1].trim());

        if (userId <= 0 ||
            vinylId <= 0) {

            throw new IllegalArgumentException(
                "Los identificadores deben ser positivos"
            );
        }

        Review review = new Review();

        review.setUserId(userId);
        review.setVinylId(vinylId);
        review.setComment(values[2].trim());

        return reviewRepository.save(review);
    }
}