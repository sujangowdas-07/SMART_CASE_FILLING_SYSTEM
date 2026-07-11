package com.legalease.controller;

import com.legalease.dto.DocumentResponse;
import com.legalease.entity.User;
import com.legalease.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caseId") Long caseId,
            @RequestParam(value = "category", required = false) String category,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(documentService.uploadDocument(caseId, file, category, user));
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(documentService.getDocumentsByCase(caseId));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<DocumentResponse> verifyDocument(@PathVariable Long id,
                                                            @RequestBody Map<String, String> body,
                                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(documentService.verifyDocument(id, body.get("status"), user));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) throws MalformedURLException {
        Path filePath = documentService.getDocumentPath(id);
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .body(resource);
    }
}
