package com.uade.tpo.marketplace.service;

import org.springframework.stereotype.Component;

import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.exceptions.forbidden.ResourceOwnershipException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OwnershipGuard {

    private final UserRepository userRepository;

    public User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", email));
    }

    public User assertSelfOrAdmin(String requesterEmail, Long targetUserId) {
        User requester = requireUser(requesterEmail);
        if (requester.getRole() != Role.ADMIN && !requester.getId().equals(targetUserId)) {
            throw new ResourceOwnershipException();
        }
        return requester;
    }
}