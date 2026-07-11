package com.legalease.service;

import com.legalease.dto.AIClassifyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIClassifyResponse classifyCase(String complaintText) {
        try {
            ResponseEntity<AIClassifyResponse> response = restTemplate.postForEntity(
                    aiServiceUrl + "/api/classify",
                    Map.of("text", complaintText),
                    AIClassifyResponse.class
            );
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            log.warn("AI service unavailable, using mock classification: {}", e.getMessage());
        }

        // Fallback mock classification
        return getMockClassification(complaintText);
    }

    public Map<String, Object> chat(String message, List<Map<String, String>> history) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/api/chat",
                    Map.of("message", message, "history", history != null ? history : List.of()),
                    Map.class
            );
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            log.warn("AI service unavailable for chat: {}", e.getMessage());
        }

        // Fallback mock response
        return Map.of(
                "response", getMockChatResponse(message),
                "source", "mock"
        );
    }

    public Map<String, Object> summarizeDocument(String documentText) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/api/summarize",
                    Map.of("text", documentText),
                    Map.class
            );
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            log.warn("AI service unavailable for summarization: {}", e.getMessage());
        }

        return Map.of(
                "summary", "This document contains legal proceedings related to the submitted case. Key sections include party details, complaint description, and supporting evidence references.",
                "keyDates", List.of(),
                "importantSections", List.of("Party Details", "Complaint", "Evidence"),
                "source", "mock"
        );
    }

    public Map<String, Object> analyzeRisk(String caseDescription, List<String> documents) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/api/risk-analysis",
                    Map.of("description", caseDescription, "documents", documents != null ? documents : List.of()),
                    Map.class
            );
            if (response.getBody() != null) return response.getBody();
        } catch (Exception e) {
            log.warn("AI service unavailable for risk analysis: {}", e.getMessage());
        }

        return Map.of(
                "filingReadiness", 75,
                "missingDocuments", List.of("Affidavit", "Identity Proof"),
                "verificationScore", 60,
                "riskLevel", "medium",
                "recommendations", List.of(
                        "Ensure all documents are notarized",
                        "Include identity proof of all parties",
                        "Consider consulting a lawyer for legal review"
                ),
                "source", "mock"
        );
    }

    private AIClassifyResponse getMockClassification(String text) {
        String textLower = text.toLowerCase();
        String category = "civil";
        String courtType = "City Civil Court";
        String severity = "medium";

        if (textLower.contains("property") || textLower.contains("land") || textLower.contains("boundary")) {
            category = "property";
            courtType = "City Civil Court";
        } else if (textLower.contains("divorce") || textLower.contains("custody") || textLower.contains("marriage")) {
            category = "family";
            courtType = "Family Court";
        } else if (textLower.contains("salary") || textLower.contains("employment") || textLower.contains("labor")) {
            category = "labor";
            courtType = "Labour Court";
        } else if (textLower.contains("fraud") || textLower.contains("cyber") || textLower.contains("hack")) {
            category = "cybercrime";
            courtType = "Magistrate Court";
            severity = "high";
        } else if (textLower.contains("consumer") || textLower.contains("defective") || textLower.contains("product")) {
            category = "consumer";
            courtType = "Consumer Disputes Redressal Forum";
        } else if (textLower.contains("murder") || textLower.contains("assault") || textLower.contains("theft")) {
            category = "criminal";
            courtType = "Sessions Court";
            severity = "high";
        }

        return AIClassifyResponse.builder()
                .category(category)
                .courtType(courtType)
                .requiredDocuments(List.of("Identity Proof (Aadhaar/PAN)", "Address Proof",
                        "Supporting Evidence Documents", "Affidavit"))
                .severity(severity)
                .confidence(0.85)
                .summary("Based on the complaint description, this case has been classified as a " +
                         category + " matter suitable for " + courtType + ".")
                .build();
    }

    private String getMockChatResponse(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("file") || lower.contains("case") || lower.contains("complaint")) {
            return "To file a case on LegalEase, follow these steps:\n\n" +
                   "1. Go to your Dashboard and click 'File New Case'\n" +
                   "2. Select the case category (Civil, Criminal, Family, etc.)\n" +
                   "3. Describe your complaint in detail\n" +
                   "4. Upload supporting documents\n" +
                   "5. Review and submit\n\n" +
                   "Your case will be assigned a case number and you can track its progress from your dashboard.";
        } else if (lower.contains("lawyer") || lower.contains("advocate")) {
            return "You can find a lawyer through our 'Find a Lawyer' feature:\n\n" +
                   "1. Navigate to 'Find Lawyer' from the sidebar\n" +
                   "2. Filter by specialization, location, and rating\n" +
                   "3. View lawyer profiles and their experience\n" +
                   "4. Send a request to your preferred lawyer\n\n" +
                   "Our AI system also recommends lawyers based on your case type.";
        } else if (lower.contains("hearing") || lower.contains("court")) {
            return "Hearing dates are scheduled by the assigned judge. You can:\n\n" +
                   "1. Check your upcoming hearings on the Dashboard\n" +
                   "2. View hearing details in the Case Workspace\n" +
                   "3. Receive notifications when hearings are scheduled\n\n" +
                   "Make sure to have all required documents ready before the hearing date.";
        }

        return "Thank you for your question. I'm the LegalEase AI assistant, here to help with legal queries.\n\n" +
               "I can help you with:\n" +
               "• Filing a new case\n" +
               "• Finding a lawyer\n" +
               "• Understanding court procedures\n" +
               "• Document requirements\n" +
               "• Case status tracking\n\n" +
               "Please ask me about any of these topics!";
    }
}
