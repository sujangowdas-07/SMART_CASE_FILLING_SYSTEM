package com.legalease.repository;

import com.legalease.entity.Document;
import com.legalease.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByLegalCaseIdOrderByUploadedAtDesc(Long caseId);
    List<Document> findByUploadedByIdOrderByUploadedAtDesc(Long userId);
    List<Document> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);
}
