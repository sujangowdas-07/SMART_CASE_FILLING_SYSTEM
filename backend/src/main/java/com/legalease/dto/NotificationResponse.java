package com.legalease.dto;

import com.legalease.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type;
    private boolean isRead;
    private Long relatedCaseId;
    private String createdAt;

    public static NotificationResponse fromNotification(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType().name().toLowerCase())
                .isRead(n.isRead())
                .relatedCaseId(n.getRelatedCase() != null ? n.getRelatedCase().getId() : null)
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .build();
    }
}
