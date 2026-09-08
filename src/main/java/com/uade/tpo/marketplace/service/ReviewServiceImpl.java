package com.uade.tpo.marketplace.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.OrderStatusType;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewUpdateRequest;
import com.uade.tpo.marketplace.entity.dto.VinylReviewsResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.ReviewMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateReviewException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.exceptions.unprocessable.ReviewNotAllowedException;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private static final int MAX_COMMENT_LENGTH = 1000;

    /** Una compra cuenta como tal desde que esta pagada. */
    private static final Set<Long> PURCHASED_STATUS_IDS = Set.of(
            OrderStatusType.PAGADA.getId(),
            OrderStatusType.ENVIADA.getId(),
            OrderStatusType.ENTREGADA.getId());

    private final ReviewRepository reviewRepository;
    private final VinylRepository vinylRepository;
    private final OrderRepository orderRepository;
    private final OwnershipGuard ownershipGuard;

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviews() {
        return reviewRepository.findAllMostRecentFirst();
    }

    @Override
    @Transactional(readOnly = true)
    public Review getReviewById(long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Reseña", reviewId));
    }

    @Override
    @Transactional(readOnly = true)
    public VinylReviewsResponse getVinylReviews(long vinylId) {
        Vinyl vinyl = requireVinyl(vinylId);
        return ReviewMapper.toVinylReviews(vinyl, reviewRepository.findByVinylId(vinyl.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getMyReviews(String requesterEmail) {
        User user = ownershipGuard.requireCustomer(requesterEmail);
        return reviewRepository.findByUserId(user.getId());
    }

    @Override
    public Review createReview(ReviewRequest request, String requesterEmail) {
        if (request == null) {
            throw new InvalidRequestException("La reseña requiere vinilo, comentario y puntaje");
        }
        if (request.getVinylId() <= 0) {
            throw new InvalidFieldException("vinylId", "debe ser un identificador positivo");
        }
        String comment = requireComment(request.getComment());
        int score = requireScore(request.getScore());

        User user = ownershipGuard.requireCustomer(requesterEmail);
        // El userId del cuerpo es opcional, pero nunca puede apuntar a otra persona.
        if (request.getUserId() != 0) {
            ownershipGuard.assertOwner(requesterEmail, (long) request.getUserId());
        }

        Vinyl vinyl = requireVinyl(request.getVinylId());

        if (reviewRepository.findByUserIdAndVinylId(user.getId(), vinyl.getId()).isPresent()) {
            throw new DuplicateReviewException();
        }
        if (!orderRepository.hasPurchasedVinyl(user.getId(), vinyl.getId(), PURCHASED_STATUS_IDS)) {
            throw new ReviewNotAllowedException();
        }

        Review review = new Review();
        review.setUser(user);
        review.setVinyl(vinyl);
        review.setComment(comment);
        review.setScore(score);
        return reviewRepository.save(review);
    }

    @Override
    public Review updateReview(long reviewId, ReviewUpdateRequest request, String requesterEmail) {
        if (request == null || (request.getComment() == null && request.getScore() == null)) {
            throw new InvalidRequestException("Indica el comentario o el puntaje a modificar");
        }
        Review review = getReviewById(reviewId);
        ownershipGuard.assertOwner(requesterEmail, review.getUser() == null ? null : review.getUser().getId());

        if (request.getComment() != null) {
            review.setComment(requireComment(request.getComment()));
        }
        if (request.getScore() != null) {
            review.setScore(requireScore(request.getScore()));
        }
        // La reseña ya esta administrada: al vaciar cambios se dispara @PreUpdate.
        reviewRepository.flush();
        return review;
    }

    @Override
    public void deleteReview(long reviewId, String requesterEmail) {
        Review review = getReviewById(reviewId);
        // El autor puede borrar la suya; el admin ademas puede moderar.
        ownershipGuard.assertSelfOrAdmin(requesterEmail,
                review.getUser() == null ? null : review.getUser().getId());
        reviewRepository.delete(review);
    }

    private Vinyl requireVinyl(long vinylId) {
        return vinylRepository.findById(vinylId)
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", vinylId));
    }

    private String requireComment(String comment) {
        if (comment == null || comment.isBlank()) {
            throw new InvalidFieldException("comment", "no puede estar vacio");
        }
        String trimmed = comment.trim();
        if (trimmed.length() > MAX_COMMENT_LENGTH) {
            throw new InvalidFieldException("comment", "no puede superar los " + MAX_COMMENT_LENGTH + " caracteres");
        }
        return trimmed;
    }

    private int requireScore(Integer score) {
        if (score == null || score < 1 || score > 5) {
            throw new InvalidFieldException("score", "debe ser un entero entre 1 y 5");
        }
        return score;
    }
}
