package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    @Autowired private ReviewService reviewService;

    @GetMapping
    public ArrayList<Review> getReviews() { return reviewService.getReviews(); }

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable int reviewId) {
        Review review = reviewService.getReviewById(reviewId);
        return review == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(review);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody String entity) { return ResponseEntity.ok(reviewService.createReview(entity)); }
}
