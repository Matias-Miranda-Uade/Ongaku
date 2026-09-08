package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;
import com.uade.tpo.marketplace.entity.dto.ReviewUpdateRequest;
import com.uade.tpo.marketplace.entity.dto.VinylReviewsResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.ReviewMapper;
import com.uade.tpo.marketplace.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewsController {

    private final ReviewService reviewService;

    /** Listado publico. Con ?vinylId= devuelve solo las de ese producto. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(
            @RequestParam(required = false) Long vinylId) {
        List<ReviewResponse> reviews = vinylId == null
                ? reviewService.getReviews().stream().map(ReviewMapper::toResponse).toList()
                : reviewService.getVinylReviews(vinylId).getReviews();
        return ResponseEntity.ok(ApiResponse.list(reviews, "No hay reseñas cargadas"));
    }

    /** Reseñas de un producto con el promedio, como en la ficha de detalle. */
    @GetMapping("/vinyl/{vinylId}")
    public ResponseEntity<ApiResponse<VinylReviewsResponse>> getVinylReviews(@PathVariable long vinylId) {
        VinylReviewsResponse response = reviewService.getVinylReviews(vinylId);
        String message = response.getTotalReviews() == 0
                ? "Este vinilo todavia no tiene reseñas"
                : "Se encontraron " + response.getTotalReviews() + " reseña(s)";
        return ResponseEntity.ok(ApiResponse.ok(response, message));
    }

    /** Reseñas escritas por el usuario autenticado. */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(Principal principal) {
        List<ReviewResponse> reviews = reviewService.getMyReviews(principal.getName()).stream()
                .map(ReviewMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(reviews, "Todavia no escribiste reseñas"));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable long reviewId) {
        return ResponseEntity.ok(ApiResponse.ok(ReviewMapper.toResponse(reviewService.getReviewById(reviewId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestBody ReviewRequest request, Principal principal) {
        ReviewResponse response = ReviewMapper.toResponse(reviewService.createReview(request, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Reseña publicada correctamente"));
    }

    @PatchMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(@PathVariable long reviewId,
            @RequestBody ReviewUpdateRequest request, Principal principal) {
        ReviewResponse response = ReviewMapper.toResponse(
                reviewService.updateReview(reviewId, request, principal.getName()));
        return ResponseEntity.ok(ApiResponse.ok(response, "Reseña actualizada"));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> replaceReview(@PathVariable long reviewId,
            @RequestBody ReviewUpdateRequest request, Principal principal) {
        return updateReview(reviewId, request, principal);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable long reviewId, Principal principal) {
        reviewService.deleteReview(reviewId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
