package com.legalease.dto;

import com.legalease.entity.Lawyer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Arrays;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LawyerResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String barCouncilId;
    private String specialization;
    private List<String> specializations;
    private int experience;
    private double rating;
    private int casesHandled;
    private int casesWon;
    private boolean isVerified;
    private String bio;
    private String location;
    private String priceRange;
    private List<String> languages;
    private boolean available;

    public static LawyerResponse fromLawyer(Lawyer lawyer) {
        return LawyerResponse.builder()
                .id(lawyer.getId())
                .userId(lawyer.getUser().getId())
                .name(lawyer.getUser().getName())
                .email(lawyer.getUser().getEmail())
                .barCouncilId(lawyer.getBarCouncilId())
                .specialization(lawyer.getSpecialization())
                .specializations(lawyer.getSpecializations() != null ?
                        Arrays.asList(lawyer.getSpecializations().split(",\\s*")) : List.of())
                .experience(lawyer.getExperienceYears())
                .rating(lawyer.getRating())
                .casesHandled(lawyer.getCasesHandled())
                .casesWon(lawyer.getCasesWon())
                .isVerified(lawyer.isVerified())
                .bio(lawyer.getBio())
                .location(lawyer.getLocation())
                .priceRange(lawyer.getPriceRange())
                .languages(lawyer.getLanguages() != null ?
                        Arrays.asList(lawyer.getLanguages().split(",\\s*")) : List.of())
                .available(lawyer.isAvailable())
                .build();
    }
}
