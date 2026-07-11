package com.legalease.service;

import com.legalease.dto.*;
import com.legalease.entity.Lawyer;
import com.legalease.entity.User;
import com.legalease.enums.Role;
import com.legalease.exception.BadRequestException;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.LawyerRepository;
import com.legalease.repository.UserRepository;
import com.legalease.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role role = Role.CITIZEN;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                role = Role.CITIZEN;
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .phone(request.getPhone())
                .address(request.getAddress())
                .aadhaarNumber(request.getAadhaarNumber())
                .emailVerified(false)
                .active(true)
                .build();

        user = userRepository.save(user);

        // If registering as lawyer, create lawyer profile
        if (role == Role.LAWYER) {
            Lawyer lawyer = Lawyer.builder()
                    .user(user)
                    .barCouncilId(request.getBarCouncilId() != null ? request.getBarCouncilId() : "")
                    .specialization(request.getSpecialization())
                    .specializations(request.getSpecializations())
                    .experienceYears(request.getExperience() != null ? request.getExperience() : 0)
                    .rating(0.0)
                    .casesHandled(0)
                    .casesWon(0)
                    .isVerified(false)
                    .bio(request.getBio())
                    .location(request.getLocation())
                    .priceRange(request.getPriceRange())
                    .languages(request.getLanguages())
                    .available(true)
                    .build();
            lawyerRepository.save(lawyer);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.success(token, UserResponse.fromUser(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return AuthResponse.success(token, UserResponse.fromUser(user));
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }

    public User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
