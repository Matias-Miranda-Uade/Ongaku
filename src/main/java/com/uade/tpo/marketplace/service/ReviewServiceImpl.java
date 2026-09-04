package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VinylRepository vinylRepository;
    private final OrderRepository orderRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            VinylRepository vinylRepository,
            OrderRepository orderRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vinylRepository = vinylRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public ArrayList<ReviewResponse> getReviewsByVinyl(int vinylId) {
        findVinyl(vinylId);
        ArrayList<ReviewResponse> responses = new ArrayList<>();
        reviewRepository.findByVinylId(vinylId).forEach(review -> responses.add(toResponse(review)));
        return responses;
    }

    @Override
    public ReviewResponse getReviewById(int id) {
        return reviewRepository.findById((long) id).map(this::toResponse).orElse(null);
    }

    @Override
    @Transactional
    public ReviewResponse createReview(String email, ReviewRequest request) {
        User user = findUser(email);
        Vinyl vinyl = findVinyl(request.getVinylId());
        validateComment(request.getComment());
        if (!orderRepository.existsCompletedPurchase(user.getId(), vinyl.getId())) {
            throw new IllegalStateException("Solo puede reseñar productos comprados");
        }
        if (reviewRepository.findByUserIdAndVinylId(user.getId(), vinyl.getId()).isPresent()) {
            throw new IllegalStateException("Ya existe una reseña para este producto");
        }
        Review review = new Review();
        review.setUser(user);
        review.setVinyl(vinyl);
        review.setComment(request.getComment().trim());
        return toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(String email, int reviewId, ReviewRequest request) {
        validateComment(request.getComment());
        Review review = getOwnedReview(email, reviewId);
        review.setComment(request.getComment().trim());
        return toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public boolean deleteReview(String email, int reviewId) {
        Review review = getOwnedReview(email, reviewId);
        reviewRepository.delete(review);
        return true;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));
    }

    private Vinyl findVinyl(int vinylId) {
        return vinylRepository.findById((long) vinylId)
                .orElseThrow(() -> new IllegalArgumentException("El vinilo no existe"));
    }

    private Review getOwnedReview(String email, int reviewId) {
        User user = findUser(email);
        Review review = reviewRepository.findById((long) reviewId).orElse(null);
        if (review == null) {
            throw new IllegalArgumentException("La reseña no existe");
        }
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("No puede modificar esta reseña");
        }
        return review;
    }

    private void validateComment(String comment) {
        if (comment == null || comment.isBlank()) {
            throw new IllegalArgumentException("El comentario no puede estar vacío");
        }
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setVinylId(review.getVinyl().getId());
        response.setUserName(review.getUser().getFirstName());
        response.setComment(review.getComment());
        return response;
    }
}