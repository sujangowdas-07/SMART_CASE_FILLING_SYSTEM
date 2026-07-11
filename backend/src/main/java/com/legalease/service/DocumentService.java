package com.legalease.service;

import com.legalease.dto.DocumentResponse;
import com.legalease.entity.Document;
import com.legalease.entity.LegalCase;
import com.legalease.entity.User;
import com.legalease.enums.DocumentCategory;
import com.legalease.enums.VerificationStatus;
import com.legalease.exception.BadRequestException;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public DocumentResponse uploadDocument(Long caseId, MultipartFile file, String category, User uploader) {
        LegalCase legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + caseId));

        // Save file to disk
        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String storedName = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir, "case-" + caseId);
        try {
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(storedName);
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }

        DocumentCategory docCategory = DocumentCategory.EVIDENCE;
        if (category != null) {
            try {
                docCategory = DocumentCategory.valueOf(category.toUpperCase().replace(" ", "_"));
            } catch (IllegalArgumentException e) {
                // default to EVIDENCE
            }
        }

        String fileType = extension.replace(".", "");
        String fileSize = formatFileSize(file.getSize());

        Document document = Document.builder()
                .legalCase(legalCase)
                .uploadedBy(uploader)
                .fileName(originalName)
                .fileType(fileType)
                .fileSize(fileSize)
                .filePath(uploadPath.resolve(storedName).toString())
                .category(docCategory)
                .verificationStatus(VerificationStatus.PENDING)
                .version(1)
                .build();

        document = documentRepository.save(document);
        return DocumentResponse.fromDocument(document);
    }

    public List<DocumentResponse> getDocumentsByCase(Long caseId) {
        return documentRepository.findByLegalCaseIdOrderByUploadedAtDesc(caseId)
                .stream().map(DocumentResponse::fromDocument).toList();
    }

    @Transactional
    public DocumentResponse verifyDocument(Long docId, String status, User verifier) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        try {
            doc.setVerificationStatus(VerificationStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid verification status: " + status);
        }
        doc.setVerifiedBy(verifier);
        documentRepository.save(doc);

        return DocumentResponse.fromDocument(doc);
    }

    public Path getDocumentPath(Long docId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        return Paths.get(doc.getFilePath());
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        return String.format("%.1f MB", bytes / (1024.0 * 1024));
    }
}
