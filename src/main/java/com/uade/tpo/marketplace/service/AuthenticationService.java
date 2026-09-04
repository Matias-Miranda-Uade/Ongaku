package com.uade.tpo.marketplace.service;

import java.time.Instant;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.controllers.auth.AuthenticationRequest;
import com.uade.tpo.marketplace.controllers.auth.AuthenticationResponse;
import com.uade.tpo.marketplace.controllers.auth.RegisterRequest;
import com.uade.tpo.marketplace.controllers.config.JwtService;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.Cart;
import com.uade.tpo.marketplace.repository.CartRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RevokedTokenService revokedTokenService;
    private final CartRepository cartRepository;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
            String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
            if (email.isBlank() || repository.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException("El email ya existe o no es válido");
            }
                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(email)
                                .password(passwordEncoder.encode(request.getPassword()))
                                // El registro publico nunca puede otorgar privilegios de administrador.
                                .role(Role.USER)
                                .build();

                User savedUser = repository.save(user);
                Cart cart = new Cart();
                cart.setUser(savedUser);
                cartRepository.save(cart);
                var jwtToken = jwtService.generateToken(savedUser);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .build();
        }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
            String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
            authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                            email,
                                            request.getPassword()));
            var user = repository.findByEmail(email)
                            .orElseThrow();
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                            .accessToken(jwtToken)
                            .build();
    }

    public void logout(String token) {
        Instant expiresAt = jwtService.extractClaim(token, claims -> claims.getExpiration().toInstant());
        revokedTokenService.revoke(token, expiresAt);
    }
}
