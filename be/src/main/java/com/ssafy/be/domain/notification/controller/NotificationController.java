package com.ssafy.be.domain.notification.controller;

import com.ssafy.be.domain.notification.dto.response.NotificationPageResponse;
import com.ssafy.be.domain.notification.dto.response.NotificationResponse;
import com.ssafy.be.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 1. 알림 목록 조회
    @GetMapping
    public ResponseEntity<NotificationPageResponse> getNotifications(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        NotificationPageResponse response = notificationService.getNotifications(userId, page, limit);
        return ResponseEntity.ok(response);
    }

    // 2. 알림 읽음 처리
    @PatchMapping("/{notifId}/read")
    public ResponseEntity<Void> markAsRead(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long notifId
    ) {
        notificationService.readNotification(userId, notifId);
        return ResponseEntity.ok().build();
    }

    // 3. 안읽은 알림 조회
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadCount(
            @RequestHeader("X-User-Id") Long userId
    ) {
        int count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(count);
    }

    // 4. 모드 읽음 처리
    @PatchMapping("/read-all")
    public ResponseEntity<java.util.Map<String, Integer>> markAllAsRead(
            @RequestHeader("X-User-Id") Long userId
    ) {
        int updatedCount = notificationService.readAllNotifications(userId);

        return ResponseEntity.ok(java.util.Map.of("updatedCount", updatedCount));
    }
}
