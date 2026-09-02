package com.uade.tpo.marketplace.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.RevokedToken;
import com.uade.tpo.marketplace.repository.RevokedTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevokedTokenService {
    private final RevokedTokenRepository revokedTokenRepository;

    public boolean isRevoked(String token) {
        return revokedTokenRepository.existsByTokenHash(hash(token));
    }

    public void revoke(String token, Instant expiresAt) {
        String tokenHash = hash(token);
        if (!revokedTokenRepository.existsByTokenHash(tokenHash)) {
            revokedTokenRepository.save(RevokedToken.builder()
                    .tokenHash(tokenHash)
                    .expiresAt(expiresAt)
                    .build());
        }
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 no esta disponible", exception);
        }
    }
}
