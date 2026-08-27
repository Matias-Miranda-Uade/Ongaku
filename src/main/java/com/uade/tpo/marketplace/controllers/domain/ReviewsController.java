package com.uade.tpo.marketplace.controllers.domain;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("reviews")
public class ReviewsController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ArrayList<Review> getReviews() {
        return reviewService.getReviews();
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable int reviewId) {
        return reviewService.getReviewById(reviewId);
    }

    @PostMapping
    public Review createReview(@RequestBody String entity) {
        return reviewService.createReview(entity);
    }
}
