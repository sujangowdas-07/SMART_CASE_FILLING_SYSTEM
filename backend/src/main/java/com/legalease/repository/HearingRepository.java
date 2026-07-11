package com.legalease.repository;

import com.legalease.entity.Hearing;
import com.legalease.enums.HearingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HearingRepository extends JpaRepository<Hearing, Long> {
    List<Hearing> findByLegalCaseIdOrderByHearingDateDesc(Long caseId);
    List<Hearing> findByJudgeIdOrderByHearingDateAsc(Long judgeId);
    List<Hearing> findByJudgeIdAndStatusOrderByHearingDateAsc(Long judgeId, HearingStatus status);
    List<Hearing> findByStatus(HearingStatus status);
}
