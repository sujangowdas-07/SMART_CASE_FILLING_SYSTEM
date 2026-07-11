package com.legalease.repository;

import com.legalease.entity.LegalCase;
import com.legalease.enums.CaseCategory;
import com.legalease.enums.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CaseRepository extends JpaRepository<LegalCase, Long> {
    Optional<LegalCase> findByCaseNumber(String caseNumber);

    List<LegalCase> findByPetitionerIdOrderByCreatedAtDesc(Long petitionerId);

    List<LegalCase> findByRespondentIdOrderByCreatedAtDesc(Long respondentId);

    @Query("SELECT c FROM LegalCase c WHERE c.petitionerLawyer.id = :lawyerId OR c.respondentLawyer.id = :lawyerId ORDER BY c.createdAt DESC")
    List<LegalCase> findByLawyerId(@Param("lawyerId") Long lawyerId);

    List<LegalCase> findByJudgeIdOrderByCreatedAtDesc(Long judgeId);

    List<LegalCase> findByStatus(CaseStatus status);

    List<LegalCase> findByCategory(CaseCategory category);

    @Query("SELECT c FROM LegalCase c WHERE c.petitioner.id = :userId OR c.respondent.id = :userId ORDER BY c.createdAt DESC")
    List<LegalCase> findByPartyId(@Param("userId") Long userId);

    long countByStatus(CaseStatus status);

    long countByCategory(CaseCategory category);

    @Query("SELECT MAX(c.id) FROM LegalCase c")
    Long findMaxId();
}
