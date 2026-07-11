package com.legalease.dto;

import com.legalease.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private Long caseId;
    private String content;
    private String sentAt;
    private boolean isRead;

    public static MessageResponse fromMessage(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getName())
                .receiverId(m.getReceiver().getId())
                .caseId(m.getLegalCase() != null ? m.getLegalCase().getId() : null)
                .content(m.getContent())
                .sentAt(m.getSentAt() != null ? m.getSentAt().toString() : null)
                .isRead(m.isRead())
                .build();
    }
}
