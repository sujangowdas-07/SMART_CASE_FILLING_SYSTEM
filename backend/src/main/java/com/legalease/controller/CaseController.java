package com.legalease.controller;

import com.legalease.dto.CaseRequest;
import com.legalease.dto.CaseResponse;
import com.legalease.entity.User;
import com.legalease.service.CaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    public ResponseEntity<CaseResponse> fileCase(@Valid @RequestBody CaseRequest request,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.fileCase(request, user));
    }

    @GetMapping
    public ResponseEntity<List<CaseResponse>> getCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(caseService.getCasesByRole(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaseResponse> getCaseById(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CaseResponse> updateStatus(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(caseService.updateCaseStatus(id, body.get("status")));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<CaseResponse.TimelineEntry>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseTimeline(id));
    }
}
