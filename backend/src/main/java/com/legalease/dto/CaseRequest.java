package com.legalease.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CaseRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String category; // civil, criminal, family, etc.

    private String respondentName;
    private Long respondentId;

    private String priority; // low, medium, high, urgent

    private Long courtId;
}
