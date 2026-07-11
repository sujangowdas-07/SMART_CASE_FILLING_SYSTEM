package com.legalease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull
    private Long receiverId;

    private Long caseId;

    @NotBlank
    private String content;
}
