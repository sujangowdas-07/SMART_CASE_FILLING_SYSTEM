package com.legalease.controller;

import com.legalease.dto.MessageRequest;
import com.legalease.dto.MessageResponse;
import com.legalease.entity.User;
import com.legalease.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request,
                                                         @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.sendMessage(request, user));
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<List<MessageResponse>> getMessagesByCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(messageService.getMessagesByCase(caseId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(messageService.getConversations(user));
    }
}
