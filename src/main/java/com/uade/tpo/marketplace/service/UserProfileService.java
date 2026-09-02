package com.uade.tpo.marketplace.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.ChangePasswordRequest;
import com.uade.tpo.marketplace.entity.dto.UpdateProfileRequest;
import com.uade.tpo.marketplace.entity.dto.UserResponse;
import com.uade.tpo.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        return toResponse(findUser(email));
    }

    @Transactional
    public UserResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Los datos del perfil son obligatorios");
        }

        User user = findUser(currentEmail);

        if (request.getFirstName() != null) {
            user.setFirstName(requireText(request.getFirstName(), "El nombre no puede estar vacio"));
        }
        if (request.getLastName() != null) {
            user.setLastName(requireText(request.getLastName(), "El apellido no puede estar vacio"));
        }
        if (request.getEmail() != null) {
            String newEmail = requireText(request.getEmail(), "El email no puede estar vacio").toLowerCase();
            userRepository.findByEmail(newEmail)
                    .filter(existing -> !existing.getId().equals(user.getId()))
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("El email ya esta registrado");
                    });
            user.setEmail(newEmail);
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (request == null || request.getCurrentPassword() == null || request.getNewPassword() == null) {
            throw new IllegalArgumentException("La contrasena actual y la nueva son obligatorias");
        }

        User user = findUser(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contrasena actual es incorrecta");
        }
        if (request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("La nueva contrasena debe tener al menos 8 caracteres");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La nueva contrasena debe ser diferente de la actual");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private String requireText(String value, String message) {
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return trimmed;
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        return response;
    }
}
