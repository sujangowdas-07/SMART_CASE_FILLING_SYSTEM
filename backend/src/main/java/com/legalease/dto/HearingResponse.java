package com.legalease.dto;

import com.legalease.entity.Hearing;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HearingResponse {
    private Long id;
    private Long caseId;
    private String caseNumber;
    private String caseTitle;
    private Long judgeId;
    private String judgeName;
    private String hearingDate;
    private String location;
    private String remarks;
    private String nextHearingDate;
    private String orders;
    private String status;

    public static HearingResponse fromHearing(Hearing h) {
        return HearingResponse.builder()
                .id(h.getId())
                .caseId(h.getLegalCase().getId())
                .caseNumber(h.getLegalCase().getCaseNumber())
                .caseTitle(h.getLegalCase().getTitle())
                .judgeId(h.getJudge().getId())
                .judgeName(h.getJudge().getName())
                .hearingDate(h.getHearingDate() != null ? h.getHearingDate().toString() : null)
                .location(h.getLocation())
                .remarks(h.getRemarks())
                .nextHearingDate(h.getNextHearingDate() != null ? h.getNextHearingDate().toString() : null)
                .orders(h.getOrders())
                .status(h.getStatus().name().toLowerCase())
                .build();
    }
}
