package com.legalease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;
    private boolean success;
    private String error;

    public static AuthResponse success(String token, UserResponse user) {
        return AuthResponse.builder().success(true).token(token).user(user).build();
    }

    public static AuthResponse failure(String error) {
        return AuthResponse.builder().success(false).error(error).build();
    }
}
