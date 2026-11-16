package com.uade.tpo.marketplace.entity.dto;

public record ReviewEligibilityResponse(boolean purchased, boolean canReview, ReviewResponse review) {
}
