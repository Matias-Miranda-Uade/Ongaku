package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class OrderExpirationPolicy {
    private static volatile long pendingExpirationMinutes = 30;

    @Value("${application.orders.pending-expiration-minutes:30}")
    private long configuredExpirationMinutes;

    @PostConstruct
    void initialize() {
        pendingExpirationMinutes = configuredExpirationMinutes;
    }

    public static int secondsLeft(LocalDateTime createdAt) {
        if (createdAt == null) return 0;
        LocalDateTime expiresAt = createdAt.plusMinutes(pendingExpirationMinutes);
        return (int) Math.max(0, ChronoUnit.SECONDS.between(LocalDateTime.now(), expiresAt));
    }

    public static LocalDateTime cutoff() {
        return LocalDateTime.now().minusMinutes(pendingExpirationMinutes);
    }
}
