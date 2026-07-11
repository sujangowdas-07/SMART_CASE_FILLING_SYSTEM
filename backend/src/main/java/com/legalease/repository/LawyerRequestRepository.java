package com.legalease.repository;

import com.legalease.entity.LawyerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LawyerRequestRepository extends JpaRepository<LawyerRequest, Long> {
    List<LawyerRequest> findByLawyerIdOrderByCreatedAtDesc(Long lawyerId);
    List<LawyerRequest> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<LawyerRequest> findByLawyerIdAndStatus(Long lawyerId, String status);
    List<LawyerRequest> findByLegalCaseId(Long caseId);
}
