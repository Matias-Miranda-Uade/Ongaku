package com.uade.tpo.marketplace.entity.dto;

import com.uade.tpo.marketplace.entity.Role;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private Role role;
}