package com.legalease.service;

import com.legalease.dto.CaseRequest;
import com.legalease.dto.CaseResponse;
import com.legalease.entity.*;
import com.legalease.enums.*;
import com.legalease.exception.BadRequestException;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final CaseTimelineRepository timelineRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;

    @Transactional
    public CaseResponse fileCase(CaseRequest request, User petitioner) {
        CaseCategory category;
        try {
            category = CaseCategory.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid case category: " + request.getCategory());
        }

        CasePriority priority = CasePriority.MEDIUM;
        if (request.getPriority() != null) {
            try {
                priority = CasePriority.valueOf(request.getPriority().toUpperCase());
            } catch (IllegalArgumentException e) {
                // default to MEDIUM
            }
        }

        String caseNumber = generateCaseNumber(category);

        LegalCase legalCase = LegalCase.builder()
                .caseNumber(caseNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .status(CaseStatus.FILED)
                .petitioner(petitioner)
                .respondentName(request.getRespondentName())
                .filingDate(LocalDate.now())
                .priority(priority)
                .build();

        if (request.getRespondentId() != null) {
            legalCase.setRespondent(userRepository.findById(request.getRespondentId()).orElse(null));
        }

        if (request.getCourtId() != null) {
            legalCase.setCourt(courtRepository.findById(request.getCourtId()).orElse(null));
        }

        legalCase = caseRepository.save(legalCase);

        // Create initial timeline
        CaseTimeline filed = CaseTimeline.builder()
                .legalCase(legalCase)
                .step("Case Filed")
                .date(LocalDate.now().toString())
                .status("completed")
                .description("Case registered online via LegalEase")
                .sortOrder(1)
                .build();

        CaseTimeline verification = CaseTimeline.builder()
                .legalCase(legalCase)
                .step("Document Verification")
                .date(null)
                .status("current")
                .description("Documents under verification by admin")
                .sortOrder(2)
                .build();

        CaseTimeline review = CaseTimeline.builder()
                .legalCase(legalCase)
                .step("Under Review")
                .date(null)
                .status("pending")
                .description("")
                .sortOrder(3)
                .build();

        CaseTimeline hearing = CaseTimeline.builder()
                .legalCase(legalCase)
                .step("Hearing")
                .date(null)
                .status("pending")
                .description("")
                .sortOrder(4)
                .build();

        CaseTimeline judgment = CaseTimeline.builder()
                .legalCase(legalCase)
                .step("Judgment")
                .date(null)
                .status("pending")
                .description("")
                .sortOrder(5)
                .build();

        timelineRepository.saveAll(List.of(filed, verification, review, hearing, judgment));
        legalCase.setTimeline(List.of(filed, verification, review, hearing, judgment));

        return CaseResponse.fromCase(legalCase);
    }

    public List<CaseResponse> getCasesByRole(User user) {
        List<LegalCase> cases;
        switch (user.getRole()) {
            case CITIZEN:
                cases = caseRepository.findByPartyId(user.getId());
                break;
            case LAWYER:
                cases = caseRepository.findByLawyerId(user.getId());
                break;
            case JUDGE:
                cases = caseRepository.findByJudgeIdOrderByCreatedAtDesc(user.getId());
                break;
            case ADMIN:
                cases = caseRepository.findAll();
                break;
            default:
                cases = List.of();
        }
        return cases.stream().map(CaseResponse::fromCase).toList();
    }

    public CaseResponse getCaseById(Long id) {
        LegalCase legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));
        return CaseResponse.fromCase(legalCase);
    }

    @Transactional
    public CaseResponse updateCaseStatus(Long id, String newStatus) {
        LegalCase legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));

        try {
            CaseStatus status = CaseStatus.valueOf(newStatus.toUpperCase());
            legalCase.setStatus(status);
            caseRepository.save(legalCase);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + newStatus);
        }

        return CaseResponse.fromCase(legalCase);
    }

    public List<CaseResponse.TimelineEntry> getCaseTimeline(Long caseId) {
        List<CaseTimeline> timeline = timelineRepository.findByLegalCaseIdOrderBySortOrderAsc(caseId);
        return timeline.stream()
                .map(t -> CaseResponse.TimelineEntry.builder()
                        .step(t.getStep())
                        .date(t.getDate())
                        .status(t.getStatus())
                        .description(t.getDescription())
                        .build())
                .toList();
    }

    private String generateCaseNumber(CaseCategory category) {
        String code = switch (category) {
            case CIVIL -> "CIV";
            case CRIMINAL -> "CRM";
            case FAMILY -> "FAM";
            case PROPERTY -> "PRO";
            case LABOR -> "LAB";
            case CONSUMER -> "CON";
            case CYBERCRIME -> "CYB";
            case CORPORATE -> "CRP";
            case TRAFFIC -> "TRF";
            case OTHER -> "OTH";
        };
        Long maxId = caseRepository.findMaxId();
        long nextId = (maxId != null ? maxId : 0) + 1;
        return String.format("CASE-2026-%s-%06d", code, nextId);
    }
}
