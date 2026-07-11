package com.legalease.repository;

import com.legalease.entity.CaseTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaseTimelineRepository extends JpaRepository<CaseTimeline, Long> {
    List<CaseTimeline> findByLegalCaseIdOrderBySortOrderAsc(Long caseId);
}
