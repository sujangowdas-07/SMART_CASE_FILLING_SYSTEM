package com.legalease.service;

import com.legalease.dto.NotificationResponse;
import com.legalease.entity.LegalCase;
import com.legalease.entity.Notification;
import com.legalease.entity.User;
import com.legalease.enums.NotificationType;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.NotificationRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void createNotification(Long userId, String title, String message,
                                    NotificationType type, Long relatedCaseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LegalCase relatedCase = null;
        if (relatedCaseId != null) {
            relatedCase = caseRepository.findById(relatedCaseId).orElse(null);
        }

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .relatedCase(relatedCase)
                .build();

        notification = notificationRepository.save(notification);
        
        // Push the new notification over WebSocket in real time
        try {
            NotificationResponse response = NotificationResponse.fromNotification(notification);
            messagingTemplate.convertAndSend("/queue/notifications/" + userId, response);
        } catch (Exception e) {
            // log the error but do not fail the transaction
        }
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationResponse::fromNotification).toList();
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }
}
