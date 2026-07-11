package com.legalease.entity;

import com.legalease.enums.HearingStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hearings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "judge_id", nullable = false)
    private User judge;

    @Column(nullable = false)
    private LocalDateTime hearingDate;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private LocalDate nextHearingDate;

    @Column(columnDefinition = "TEXT")
    private String orders;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HearingStatus status;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = HearingStatus.SCHEDULED;
    }
}
