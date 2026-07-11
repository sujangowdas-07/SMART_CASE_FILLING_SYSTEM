package com.legalease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AIClassifyResponse {
    private String category;
    private String courtType;
    private List<String> requiredDocuments;
    private String severity;
    private double confidence;
    private String summary;
}
