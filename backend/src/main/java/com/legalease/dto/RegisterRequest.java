package com.legalease.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String role; // citizen, lawyer, judge, admin

    private String phone;
    private String address;
    private String aadhaarNumber;

    // Lawyer-specific fields
    private String barCouncilId;
    private String specialization;
    private String specializations;
    private Integer experience;
    private String bio;
    private String location;
    private String priceRange;
    private String languages;
}
