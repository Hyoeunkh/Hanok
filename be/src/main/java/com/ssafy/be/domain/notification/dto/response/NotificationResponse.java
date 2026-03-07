package com.ssafy.be.domain.notification.dto.response;

import com.ssafy.be.domain.notification.model.Notification;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NotificationResponse (
        Long id,
        String type,
        String title,
        String body,
        Boolean isRead,
        LocalDateTime createdAt,
        String actionUrl
) {
    public static NotificationResponse from(Notification noti) {
        return NotificationResponse.builder()
                .id(noti.id())
                .type(noti.type())
                .title(noti.title())
                .body(noti.body())
                .isRead(noti.isRead())
                .createdAt(noti.createdAt())
                .actionUrl(noti.actionUrl())
                .build();
    }
}
