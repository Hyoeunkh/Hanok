package com.ssafy.be.domain.chat.controller;

import com.ssafy.be.domain.chat.dto.request.ChatMessageRequest;
import com.ssafy.be.domain.chat.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/stream/{streamId}")
    public void handleChatMessage(
            @DestinationVariable Long streamId,
            @Payload @Valid ChatMessageRequest request,
            Principal principal                          // ✅ STOMP Principal
    ) {
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) principal;

        Long userId  = Long.parseLong(principal.getName());
        String nickname = (String) authentication.getDetails();

        chatService.handleMessage(userId, nickname, request);
    }
}
