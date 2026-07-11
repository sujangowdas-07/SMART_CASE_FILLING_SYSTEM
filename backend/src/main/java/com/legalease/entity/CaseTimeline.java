package com.legalease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "case_timeline")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CaseTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @Column(nullable = false)
    private String step;

    private String date;

    @Column(nullable = false)
    private String status; // completed, current, pending

    @Column(columnDefinition = "TEXT")
    private String description;

    private int sortOrder;
}
