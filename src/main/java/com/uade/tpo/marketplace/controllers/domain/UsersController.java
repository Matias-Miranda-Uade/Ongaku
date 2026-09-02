package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.dto.ChangePasswordRequest;
import com.uade.tpo.marketplace.entity.dto.UpdateProfileRequest;
import com.uade.tpo.marketplace.entity.dto.UserResponse;
import com.uade.tpo.marketplace.service.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UsersController {
    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Principal principal) {
        return ResponseEntity.ok(userProfileService.getProfile(principal.getName()));
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateProfile(
            Principal principal,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userProfileService.updateProfile(principal.getName(), request));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            Principal principal,
            @RequestBody ChangePasswordRequest request) {
        userProfileService.changePassword(principal.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
