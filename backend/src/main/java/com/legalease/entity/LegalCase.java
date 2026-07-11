package com.legalease.entity;

import com.legalease.enums.CaseCategory;
import com.legalease.enums.CasePriority;
import com.legalease.enums.CaseStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LegalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String caseNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petitioner_id")
    private User petitioner;

    private String respondentName; // Can be a non-user entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "respondent_id")
    private User respondent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petitioner_lawyer_id")
    private User petitionerLawyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "respondent_lawyer_id")
    private User respondentLawyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "judge_id")
    private User judge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id")
    private Court court;

    private LocalDate filingDate;

    @Enumerated(EnumType.STRING)
    private CasePriority priority;

    @OneToMany(mappedBy = "legalCase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CaseTimeline> timeline = new ArrayList<>();

    @OneToMany(mappedBy = "legalCase", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "legalCase", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Hearing> hearings = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (filingDate == null) filingDate = LocalDate.now();
        if (status == null) status = CaseStatus.FILED;
    }
}
