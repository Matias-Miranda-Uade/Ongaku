package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.dto.ReviewRequest;
import com.uade.tpo.marketplace.entity.dto.ReviewResponse;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    @Autowired private ReviewService reviewService;

    @GetMapping("/vinyl/{vinylId}")
    public ArrayList<ReviewResponse> getReviewsByVinyl(@PathVariable int vinylId) {
        return reviewService.getReviewsByVinyl(vinylId);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable int reviewId) {
        ReviewResponse review = reviewService.getReviewById(reviewId);
        return review == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(review);
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(Principal principal, @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(principal.getName(), request));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            Principal principal,
            @PathVariable int reviewId,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(principal.getName(), reviewId, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(Principal principal, @PathVariable int reviewId) {
        reviewService.deleteReview(principal.getName(), reviewId);
        return ResponseEntity.noContent().build();
    }

}
