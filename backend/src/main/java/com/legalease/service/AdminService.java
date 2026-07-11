package com.legalease.service;

import com.legalease.dto.UserResponse;
import com.legalease.entity.Lawyer;
import com.legalease.entity.User;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.LawyerRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final CaseRepository caseRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(active);
        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    public List<Lawyer> getAllLawyers() {
        return lawyerRepository.findAll();
    }

    @Transactional
    public Lawyer verifyLawyer(Long lawyerId, boolean isVerified) {
        Lawyer lawyer = lawyerRepository.findById(lawyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found"));
        lawyer.setVerified(isVerified);
        return lawyerRepository.save(lawyer);
    }

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalLawyers", lawyerRepository.count());
        stats.put("verifiedLawyers", lawyerRepository.countByIsVerified(true));
        stats.put("totalCases", caseRepository.count());
        return stats;
    }
}
