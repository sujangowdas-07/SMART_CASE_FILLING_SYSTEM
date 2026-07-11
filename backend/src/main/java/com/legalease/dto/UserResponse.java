package com.legalease.dto;

import com.legalease.entity.Lawyer;
import com.legalease.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String address;
    private String aadhaarNumber;
    private String profilePhoto;
    private boolean emailVerified;
    private String createdAt;

    // Lawyer-specific fields (only populated for lawyers)
    private String barCouncilId;
    private String specialization;
    private Integer experience;
    private Double rating;
    private Integer casesHandled;
    private Boolean isVerified;
    private String bio;
    private String courtName; // For judges

    public static UserResponse fromUser(User user) {
        UserResponseBuilder builder = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .phone(user.getPhone())
                .address(user.getAddress())
                .aadhaarNumber(user.getAadhaarNumber())
                .profilePhoto(user.getProfilePhoto())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate().toString() : null);

        // Add lawyer-specific fields
        if (user.getLawyerProfile() != null) {
            Lawyer lawyer = user.getLawyerProfile();
            builder.barCouncilId(lawyer.getBarCouncilId())
                   .specialization(lawyer.getSpecialization())
                   .experience(lawyer.getExperienceYears())
                   .rating(lawyer.getRating())
                   .casesHandled(lawyer.getCasesHandled())
                   .isVerified(lawyer.isVerified());
                   builder.bio(lawyer.getBio());
        }

        return builder.build();
    }
}
