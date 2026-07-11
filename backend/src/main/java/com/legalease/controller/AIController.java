package com.legalease.controller;

import com.legalease.dto.AIClassifyResponse;
import com.legalease.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/classify")
    public ResponseEntity<AIClassifyResponse> classifyCase(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(aiService.classifyCase(body.get("text")));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        String message = (String) body.get("message");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) body.get("history");
        return ResponseEntity.ok(aiService.chat(message, history));
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, Object>> summarize(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(aiService.summarizeDocument(body.get("text")));
    }

    @PostMapping("/risk-analysis")
    public ResponseEntity<Map<String, Object>> riskAnalysis(@RequestBody Map<String, Object> body) {
        String description = (String) body.get("description");
        @SuppressWarnings("unchecked")
        List<String> documents = (List<String>) body.get("documents");
        return ResponseEntity.ok(aiService.analyzeRisk(description, documents));
    }
}
