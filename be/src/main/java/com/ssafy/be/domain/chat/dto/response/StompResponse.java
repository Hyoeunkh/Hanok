package com.ssafy.be.domain.chat.dto.response;

import com.ssafy.be.global.websocket.enums.StompType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StompResponse<T>(
        StompType stompType,
        T payload,
        LocalDateTime timestamp

) {
}
