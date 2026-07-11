package com.legalease.service;

import com.legalease.dto.MessageRequest;
import com.legalease.dto.MessageResponse;
import com.legalease.entity.LegalCase;
import com.legalease.entity.Message;
import com.legalease.entity.User;
import com.legalease.exception.ResourceNotFoundException;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.MessageRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Transactional
    public MessageResponse sendMessage(MessageRequest request, User sender) {
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        LegalCase legalCase = null;
        if (request.getCaseId() != null) {
            legalCase = caseRepository.findById(request.getCaseId()).orElse(null);
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .legalCase(legalCase)
                .content(request.getContent())
                .isRead(false)
                .build();

        message = messageRepository.save(message);
        MessageResponse response = MessageResponse.fromMessage(message);

        // Broadcast to case topic if it's case-related
        if (legalCase != null) {
            messagingTemplate.convertAndSend("/topic/case/" + legalCase.getId(), response);
        }

        // Push directly to receiver's queue for real-time inbox updates
        messagingTemplate.convertAndSend("/queue/messages/" + receiver.getId(), response);

        return response;
    }

    public List<MessageResponse> getMessagesByCase(Long caseId) {
        return messageRepository.findByLegalCaseIdOrderBySentAtAsc(caseId)
                .stream().map(MessageResponse::fromMessage).toList();
    }

    public List<Map<String, Object>> getConversations(User user) {
        List<Message> allMessages = messageRepository.findByUserId(user.getId());

        // Group by the other user in the conversation
        Map<Long, List<Message>> grouped = new LinkedHashMap<>();
        for (Message m : allMessages) {
            Long otherUserId = m.getSender().getId().equals(user.getId())
                    ? m.getReceiver().getId() : m.getSender().getId();
            grouped.computeIfAbsent(otherUserId, k -> new ArrayList<>()).add(m);
        }

        return grouped.entrySet().stream().map(entry -> {
            Message lastMessage = entry.getValue().get(0); // already sorted DESC
            User otherUser = lastMessage.getSender().getId().equals(user.getId())
                    ? lastMessage.getReceiver() : lastMessage.getSender();

            long unread = entry.getValue().stream()
                    .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.isRead())
                    .count();

            return Map.<String, Object>of(
                    "userId", otherUser.getId(),
                    "userName", otherUser.getName(),
                    "lastMessage", lastMessage.getContent(),
                    "lastMessageAt", lastMessage.getSentAt().toString(),
                    "unreadCount", unread,
                    "caseId", lastMessage.getLegalCase() != null ? lastMessage.getLegalCase().getId() : 0
            );
        }).collect(Collectors.toList());
    }
}
