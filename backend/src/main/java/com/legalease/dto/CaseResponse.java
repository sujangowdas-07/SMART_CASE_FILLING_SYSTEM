package com.legalease.dto;

import com.legalease.entity.CaseTimeline;
import com.legalease.entity.LegalCase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CaseResponse {
    private Long id;
    private String caseNumber;
    private String title;
    private String description;
    private String category;
    private String status;
    private Long petitionerId;
    private String petitionerName;
    private Long respondentId;
    private String respondentName;
    private Long petitionerLawyerId;
    private String petitionerLawyerName;
    private Long respondentLawyerId;
    private String respondentLawyerName;
    private Long judgeId;
    private String judgeName;
    private Long courtId;
    private String courtName;
    private String filingDate;
    private String priority;
    private List<TimelineEntry> timeline;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TimelineEntry {
        private String step;
        private String date;
        private String status;
        private String description;
    }

    public static CaseResponse fromCase(LegalCase c) {
        CaseResponseBuilder builder = CaseResponse.builder()
                .id(c.getId())
                .caseNumber(c.getCaseNumber())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory().name().toLowerCase())
                .status(c.getStatus().name().toLowerCase())
                .filingDate(c.getFilingDate() != null ? c.getFilingDate().toString() : null)
                .priority(c.getPriority() != null ? c.getPriority().name().toLowerCase() : null);

        if (c.getPetitioner() != null) {
            builder.petitionerId(c.getPetitioner().getId())
                   .petitionerName(c.getPetitioner().getName());
        }
        if (c.getRespondent() != null) {
            builder.respondentId(c.getRespondent().getId())
                   .respondentName(c.getRespondent().getName());
        } else {
            builder.respondentName(c.getRespondentName());
        }
        if (c.getPetitionerLawyer() != null) {
            builder.petitionerLawyerId(c.getPetitionerLawyer().getId())
                   .petitionerLawyerName(c.getPetitionerLawyer().getName());
        }
        if (c.getRespondentLawyer() != null) {
            builder.respondentLawyerId(c.getRespondentLawyer().getId())
                   .respondentLawyerName(c.getRespondentLawyer().getName());
        }
        if (c.getJudge() != null) {
            builder.judgeId(c.getJudge().getId())
                   .judgeName(c.getJudge().getName());
        }
        if (c.getCourt() != null) {
            builder.courtId(c.getCourt().getId())
                   .courtName(c.getCourt().getName());
        }

        if (c.getTimeline() != null) {
            builder.timeline(c.getTimeline().stream()
                    .map(t -> TimelineEntry.builder()
                            .step(t.getStep())
                            .date(t.getDate())
                            .status(t.getStatus())
                            .description(t.getDescription())
                            .build())
                    .toList());
        }

        return builder.build();
    }
}
