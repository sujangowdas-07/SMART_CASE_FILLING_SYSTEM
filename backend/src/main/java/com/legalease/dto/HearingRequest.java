package com.legalease.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HearingRequest {
    @NotNull
    private Long caseId;

    @NotNull
    private String hearingDate; // ISO datetime string

    private String location;
    private String remarks;
}
