package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VinylRepository vinylRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            VinylRepository vinylRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Review> getReviews() {
        return new ArrayList<>(reviewRepository.findAll());
    }

    @Override
    public Review getReviewById(int id) {
        return reviewRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Review createReview(String entity) {

        String[] values = entity == null
                ? new String[0]
                : entity.split(",", 3);

        if (values.length < 3 ||
                values[2].trim().isBlank()) {

            throw new IllegalArgumentException(
                    "La reseña requiere usuario, vinilo y comentario");
        }

        int userId = Integer.parseInt(values[0].trim());
        int vinylId = Integer.parseInt(values[1].trim());

        User user = userRepository
                .findById((long) userId)
                .orElse(null);

        if (user == null) {
            throw new IllegalArgumentException(
                    "El usuario no existe");
        }

        Vinyl vinyl = vinylRepository
                .findById((long) vinylId)
                .orElse(null);

        if (vinyl == null) {
            throw new IllegalArgumentException(
                    "El vinilo no existe");
        }

        Review review = new Review();

        review.setUser(user);
        review.setVinyl(vinyl);
        review.setComment(values[2].trim());

        return reviewRepository.save(review);
    }
}