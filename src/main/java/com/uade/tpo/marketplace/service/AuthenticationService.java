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
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.badrequest.WeakPasswordException;
import com.uade.tpo.marketplace.exceptions.conflict.EmailAlreadyRegisteredException;
import com.uade.tpo.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RevokedTokenService revokedTokenService;
    private final CartService cartService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
                if (request == null) {
                        throw new InvalidRequestException("Los datos de registro son obligatorios");
                }
                String email = requireText(request.getEmail(), "email");
                String password = request.getPassword() == null ? "" : request.getPassword();
                if (password.length() < MIN_PASSWORD_LENGTH) {
                        throw new WeakPasswordException();
                }
                if (repository.findByEmail(email).isPresent()) {
                        throw new EmailAlreadyRegisteredException();
                }

                var user = User.builder()
                                .firstName(requireText(request.getFirstName(), "firstName"))
                                .lastName(requireText(request.getLastName(), "lastName"))
                                .email(email)
                                .password(passwordEncoder.encode(password))
                                .role(request.getRole() != null ? request.getRole() : Role.USER)
                                .build();

                repository.save(user);
                // Todo comprador arranca con su carrito vacio ya asociado.
                cartService.createCartFor(user);

                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .build();
        }

    private String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new InvalidFieldException(field, "no puede estar vacio");
        }
        return value.trim();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
            authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                            request.getEmail(),
                                            request.getPassword()));
            var user = repository.findByEmail(request.getEmail())
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
