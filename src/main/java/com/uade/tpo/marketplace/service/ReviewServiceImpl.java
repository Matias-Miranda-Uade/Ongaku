package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateReviewException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.exceptions.unprocessable.ReviewNotAllowedException;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final VinylRepository vinylRepository;
    private final OrderRepository orderRepository;
    private final OwnershipGuard ownershipGuard;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            VinylRepository vinylRepository,
            OrderRepository orderRepository,
            OwnershipGuard ownershipGuard) {

        this.reviewRepository = reviewRepository;
        this.vinylRepository = vinylRepository;
        this.orderRepository = orderRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @Override
    public ArrayList<Review> getReviews() {
        return new ArrayList<>(reviewRepository.findAll());
    }

    @Override
    public Review getReviewById(int id) {
        return reviewRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña", id));
    }

    @Override
    public Review createReview(ReviewRequest request, String requesterEmail) {

        if (request == null) {
            throw new InvalidRequestException("La reseña requiere usuario, vinilo y comentario");
        }
        if (request.getUserId() <= 0) {
            throw new InvalidFieldException("userId", "debe ser un identificador positivo");
        }
        if (request.getVinylId() <= 0) {
            throw new InvalidFieldException("vinylId", "debe ser un identificador positivo");
        }
        if (request.getComment() == null || request.getComment().isBlank()) {
            throw new InvalidFieldException("comment", "no puede estar vacio");
        }

        User user = ownershipGuard.assertSelfOrAdmin(requesterEmail, (long) request.getUserId());

        Vinyl vinyl = vinylRepository.findById((long) request.getVinylId())
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", request.getVinylId()));

        boolean alreadyReviewed = reviewRepository.findByUserId(request.getUserId()).stream()
                .anyMatch(r -> r.getVinyl() != null && r.getVinyl().getId().equals(vinyl.getId()));
        if (alreadyReviewed) {
            throw new DuplicateReviewException();
        }

        boolean purchased = orderRepository.findByUserId(request.getUserId()).stream()
                .filter(order -> order.getVinyl() != null)
                .flatMap(order -> order.getVinyl().stream())
                .anyMatch(v -> v.getId().equals(vinyl.getId()));
        if (!purchased) {
            throw new ReviewNotAllowedException();
        }

        Review review = new Review();
        review.setUser(user);
        review.setVinyl(vinyl);
        review.setComment(request.getComment().trim());

        return reviewRepository.save(review);
    }
}