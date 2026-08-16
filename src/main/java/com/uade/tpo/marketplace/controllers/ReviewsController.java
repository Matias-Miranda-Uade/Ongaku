package com.uade.tpo.marketplace.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("reviews")
public class ReviewsController {

    @GetMapping
    public ArrayList<Review> getReviews() {
        ReviewService reviewService = new ReviewService();
        return reviewService.getReviews();
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable int reviewId) {
        ReviewService reviewService = new ReviewService();
        return reviewService.getReviewById(reviewId);
    }

    @PostMapping
    public Review createReview(@RequestBody String entity) {
        ReviewService reviewService = new ReviewService();
        return reviewService.createReview(entity);
    }
}
