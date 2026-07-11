package com.legalease.controller;

import com.legalease.dto.LawyerResponse;
import com.legalease.entity.User;
import com.legalease.service.LawyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lawyers")
@RequiredArgsConstructor
public class LawyerController {

    private final LawyerService lawyerService;

    @GetMapping
    public ResponseEntity<List<LawyerResponse>> searchLawyers(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(lawyerService.searchLawyers(specialization, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LawyerResponse> getLawyer(@PathVariable Long id) {
        return ResponseEntity.ok(lawyerService.getLawyerById(id));
    }

    @PostMapping("/{id}/request")
    public ResponseEntity<Map<String, Object>> requestLawyer(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerService.requestLawyer(id, body.get("caseId"), user));
    }

    @PutMapping("/requests/{id}/respond")
    public ResponseEntity<Map<String, Object>> respondToRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerService.respondToRequest(id, body.get("response"), user));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerService.getPendingRequests(user.getId()));
    }
}
