package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.ReviewMapper;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    @Autowired private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews() {
        List<ReviewResponse> reviews = reviewService.getReviews().stream().map(ReviewMapper::toResponse).toList();
        return ResponseEntity.ok(ApiResponse.list(reviews, "No hay reseñas cargadas"));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable int reviewId) {
        return ResponseEntity.ok(ApiResponse.ok(ReviewMapper.toResponse(reviewService.getReviewById(reviewId))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@RequestBody ReviewRequest request, Principal principal) {
        ReviewResponse response = ReviewMapper.toResponse(reviewService.createReview(request, principal.getName()));
        return ResponseEntity.status(201).body(ApiResponse.created(response, "Reseña publicada correctamente"));
    }
}