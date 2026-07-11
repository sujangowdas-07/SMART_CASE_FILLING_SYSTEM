package com.legalease.controller;

import com.legalease.dto.HearingRequest;
import com.legalease.dto.HearingResponse;
import com.legalease.entity.User;
import com.legalease.service.HearingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hearings")
@RequiredArgsConstructor
public class HearingController {

    private final HearingService hearingService;

    @PostMapping
    public ResponseEntity<HearingResponse> scheduleHearing(@Valid @RequestBody HearingRequest request,
                                                             @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(hearingService.scheduleHearing(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HearingResponse> updateHearing(@PathVariable Long id,
                                                           @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(hearingService.updateHearing(
                id, body.get("remarks"), body.get("orders"),
                body.get("nextHearingDate"), body.get("status")));
    }

    @GetMapping("/judge/{judgeId}")
    public ResponseEntity<List<HearingResponse>> getJudgeHearings(@PathVariable Long judgeId) {
        return ResponseEntity.ok(hearingService.getHearingsByJudge(judgeId));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<HearingResponse>> getCaseHearings(@PathVariable Long caseId) {
        return ResponseEntity.ok(hearingService.getHearingsByCase(caseId));
    }
}
