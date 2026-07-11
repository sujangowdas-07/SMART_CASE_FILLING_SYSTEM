package com.legalease.service;

import com.legalease.dto.LawyerResponse;
import com.legalease.entity.Lawyer;
import com.legalease.entity.LawyerRequest;
import com.legalease.entity.LegalCase;
import com.legalease.entity.User;
import com.legalease.exception.BadRequestException;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.LawyerRepository;
import com.legalease.repository.LawyerRequestRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LawyerService {

    private final LawyerRepository lawyerRepository;
    private final LawyerRequestRepository lawyerRequestRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public List<LawyerResponse> searchLawyers(String specialization, String location) {
        List<Lawyer> lawyers = lawyerRepository.searchLawyers(specialization, location);
        return lawyers.stream().map(LawyerResponse::fromLawyer).toList();
    }

    public LawyerResponse getLawyerById(Long id) {
        Lawyer lawyer = lawyerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found with id: " + id));
        return LawyerResponse.fromLawyer(lawyer);
    }

    public LawyerResponse getLawyerByUserId(Long userId) {
        Lawyer lawyer = lawyerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer profile not found"));
        return LawyerResponse.fromLawyer(lawyer);
    }

    @Transactional
    public Map<String, Object> requestLawyer(Long lawyerId, Long caseId, User citizen) {
        Lawyer lawyer = lawyerRepository.findById(lawyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Lawyer not found"));
        LegalCase legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found"));

        LawyerRequest request = LawyerRequest.builder()
                .legalCase(legalCase)
                .citizen(citizen)
                .lawyer(lawyer.getUser())
                .message("Request to represent in case " + legalCase.getCaseNumber())
                .build();

        lawyerRequestRepository.save(request);
        return Map.of("success", true, "message", "Request sent to " + lawyer.getUser().getName());
    }

    @Transactional
    public Map<String, Object> respondToRequest(Long requestId, String response, User lawyer) {
        LawyerRequest request = lawyerRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getLawyer().getId().equals(lawyer.getId())) {
            throw new BadRequestException("You are not authorized to respond to this request");
        }

        request.setStatus(response.toUpperCase());
        lawyerRequestRepository.save(request);

        // If accepted, assign lawyer to case
        if ("ACCEPTED".equalsIgnoreCase(response)) {
            LegalCase legalCase = request.getLegalCase();
            if (legalCase.getPetitionerLawyer() == null) {
                legalCase.setPetitionerLawyer(lawyer);
            } else {
                legalCase.setRespondentLawyer(lawyer);
            }
            caseRepository.save(legalCase);
        }

        return Map.of("success", true, "message", "Request " + response.toLowerCase());
    }

    public List<Map<String, Object>> getPendingRequests(Long lawyerId) {
        List<LawyerRequest> requests = lawyerRequestRepository.findByLawyerIdAndStatus(lawyerId, "PENDING");
        return requests.stream().map(r -> Map.<String, Object>of(
                "id", r.getId(),
                "caseNumber", r.getLegalCase().getCaseNumber(),
                "caseTitle", r.getLegalCase().getTitle(),
                "citizenName", r.getCitizen().getName(),
                "message", r.getMessage() != null ? r.getMessage() : "",
                "createdAt", r.getCreatedAt().toString()
        )).toList();
    }
}
