package com.legalease.dto;

import com.legalease.entity.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private Long caseId;
    private Long uploadedBy;
    private String uploaderName;
    private String fileName;
    private String fileType;
    private String fileSize;
    private String category;
    private String verificationStatus;
    private int version;
    private String uploadedAt;

    public static DocumentResponse fromDocument(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .caseId(doc.getLegalCase().getId())
                .uploadedBy(doc.getUploadedBy().getId())
                .uploaderName(doc.getUploadedBy().getName())
                .fileName(doc.getFileName())
                .fileType(doc.getFileType())
                .fileSize(doc.getFileSize())
                .category(doc.getCategory() != null ? doc.getCategory().name() : null)
                .verificationStatus(doc.getVerificationStatus().name().toLowerCase())
                .version(doc.getVersion())
                .uploadedAt(doc.getUploadedAt() != null ? doc.getUploadedAt().toString() : null)
                .build();
    }
}
