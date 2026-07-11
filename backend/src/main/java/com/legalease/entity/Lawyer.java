package com.legalease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lawyers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lawyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String barCouncilId;

    private String specialization;

    @Column(columnDefinition = "TEXT")
    private String specializations; // comma-separated list

    private int experienceYears;

    private double rating;

    private int casesHandled;

    private int casesWon;

    @Column(nullable = false)
    private boolean isVerified = false;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    private String priceRange;

    private String languages; // comma-separated

    private boolean available = true;
}
