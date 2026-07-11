package com.legalease.service;

import com.legalease.dto.HearingRequest;
import com.legalease.dto.HearingResponse;
import com.legalease.entity.Hearing;
import com.legalease.entity.LegalCase;
import com.legalease.entity.User;
import com.legalease.enums.CaseStatus;
import com.legalease.enums.HearingStatus;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.HearingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HearingService {

    private final HearingRepository hearingRepository;
    private final CaseRepository caseRepository;

    @Transactional
    public HearingResponse scheduleHearing(HearingRequest request, User judge) {
        LegalCase legalCase = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case not found"));

        Hearing hearing = Hearing.builder()
                .legalCase(legalCase)
                .judge(judge)
                .hearingDate(LocalDateTime.parse(request.getHearingDate()))
                .location(request.getLocation())
                .remarks(request.getRemarks())
                .status(HearingStatus.SCHEDULED)
                .build();

        hearing = hearingRepository.save(hearing);

        // Update case status and assign judge
        legalCase.setStatus(CaseStatus.HEARING_SCHEDULED);
        legalCase.setJudge(judge);
        caseRepository.save(legalCase);

        return HearingResponse.fromHearing(hearing);
    }

    @Transactional
    public HearingResponse updateHearing(Long hearingId, String remarks, String orders,
                                          String nextHearingDate, String status) {
        Hearing hearing = hearingRepository.findById(hearingId)
                .orElseThrow(() -> new ResourceNotFoundException("Hearing not found"));

        if (remarks != null) hearing.setRemarks(remarks);
        if (orders != null) hearing.setOrders(orders);
        if (nextHearingDate != null) hearing.setNextHearingDate(LocalDate.parse(nextHearingDate));
        if (status != null) {
            try {
                hearing.setStatus(HearingStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        hearingRepository.save(hearing);
        return HearingResponse.fromHearing(hearing);
    }

    public List<HearingResponse> getHearingsByJudge(Long judgeId) {
        return hearingRepository.findByJudgeIdOrderByHearingDateAsc(judgeId)
                .stream().map(HearingResponse::fromHearing).toList();
    }

    public List<HearingResponse> getHearingsByCase(Long caseId) {
        return hearingRepository.findByLegalCaseIdOrderByHearingDateDesc(caseId)
                .stream().map(HearingResponse::fromHearing).toList();
    }
}
