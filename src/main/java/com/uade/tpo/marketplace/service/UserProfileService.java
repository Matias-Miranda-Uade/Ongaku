package com.uade.tpo.marketplace.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.ChangePasswordRequest;
import com.uade.tpo.marketplace.entity.dto.UpdateProfileRequest;
import com.uade.tpo.marketplace.entity.dto.UserResponse;
import com.uade.tpo.marketplace.entity.dto.mapper.UserMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidCurrentPasswordException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.badrequest.SamePasswordException;
import com.uade.tpo.marketplace.exceptions.badrequest.WeakPasswordException;
import com.uade.tpo.marketplace.exceptions.conflict.EmailAlreadyRegisteredException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class UserProfileService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        return UserMapper.toResponse(findUser(email));
    }

    @Transactional
    public UserResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Los datos del perfil son obligatorios");
        }
        User user = findUser(currentEmail);
        if (request.getFirstName() != null) {
            user.setFirstName(requireText(request.getFirstName(), "firstName"));
        }
        if (request.getLastName() != null) {
            user.setLastName(requireText(request.getLastName(), "lastName"));
        }
        if (request.getEmail() != null) {
            String newEmail = requireText(request.getEmail(), "email").toLowerCase();
            userRepository.findByEmail(newEmail).filter(existing -> !existing.getId().equals(user.getId())).ifPresent(existing -> {
                throw new EmailAlreadyRegisteredException();
            });
            user.setEmail(newEmail);
        }
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (request == null || request.getCurrentPassword() == null || request.getNewPassword() == null) {
            throw new InvalidRequestException("La contraseña actual y la nueva son obligatorias");
        }
        User user = findUser(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException();
        }
        if (request.getNewPassword().length() < 8) {
            throw new WeakPasswordException();
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new SamePasswordException();
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuario", email));
    }

    private String requireText(String value, String field) {
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            throw new InvalidFieldException(field, "no puede estar vacio");
        }
        return trimmed;
    }

    public UserProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
}
