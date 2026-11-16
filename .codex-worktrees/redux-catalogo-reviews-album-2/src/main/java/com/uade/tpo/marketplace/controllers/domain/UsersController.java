package com.uade.tpo.marketplace.controllers.domain;

import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.marketplace.common.ApiResponse;
import com.uade.tpo.marketplace.entity.dto.ChangePasswordRequest;
import com.uade.tpo.marketplace.entity.dto.UpdateProfileRequest;
import com.uade.tpo.marketplace.entity.dto.UserResponse;
import com.uade.tpo.marketplace.service.UserProfileService;

@RestController
@RequestMapping("/users/me")
public class UsersController {
    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Principal principal) {
        return ResponseEntity.ok(ApiResponse.ok(userProfileService.getProfile(principal.getName())));
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(Principal principal, @RequestBody UpdateProfileRequest request) {
        UserResponse response = userProfileService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Perfil actualizado correctamente"));
    }

    @PatchMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(Principal principal, @RequestBody ChangePasswordRequest request) {
        userProfileService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Contraseña actualizada correctamente"));
    }

    public UsersController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }
}
