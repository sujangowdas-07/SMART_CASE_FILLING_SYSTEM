package com.legalease.controller;

import com.legalease.dto.CourtResponse;
import com.legalease.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class CourtController {

    private final CourtRepository courtRepository;

    @GetMapping
    public ResponseEntity<List<CourtResponse>> getAllCourts() {
        return ResponseEntity.ok(courtRepository.findAll().stream()
                .map(CourtResponse::fromCourt).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourtResponse> getCourtById(@PathVariable Long id) {
        return courtRepository.findById(id)
                .map(c -> ResponseEntity.ok(CourtResponse.fromCourt(c)))
                .orElse(ResponseEntity.notFound().build());
    }
}
