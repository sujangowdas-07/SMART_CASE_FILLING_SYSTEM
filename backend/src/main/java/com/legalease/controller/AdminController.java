package com.legalease.controller;

import com.legalease.dto.UserResponse;
import com.legalease.entity.Lawyer;
import com.legalease.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.updateUserStatus(userId, active));
    }

    @GetMapping("/lawyers")
    public ResponseEntity<List<Lawyer>> getAllLawyers() {
        return ResponseEntity.ok(adminService.getAllLawyers());
    }

    @PutMapping("/lawyers/{lawyerId}/verify")
    public ResponseEntity<Lawyer> verifyLawyer(
            @PathVariable Long lawyerId,
            @RequestParam boolean isVerified) {
        return ResponseEntity.ok(adminService.verifyLawyer(lawyerId, isVerified));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }
}
