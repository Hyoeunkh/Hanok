package com.ssafy.be.domain.chat.controller;

import com.ssafy.be.domain.chat.dto.request.ChatMessageRequest;
import com.ssafy.be.domain.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/stream/{streamId}")
    public void handleChatMessage(
            @AuthenticationPrincipal String userId,
            @DestinationVariable Long streamId,
            @Payload @Valid ChatMessageRequest request,
            Authentication authentication
            ) {
        String nickname = (String) ((UsernamePasswordAuthenticationToken)authentication).getDetails();
        chatService.handleMessage(Long.parseLong(userId),nickname, request);

    }

    private String extractNickname(Principal principal) { return principal.getName(); }
}
