package com.ssafy.be.domain.notification.service;

// ── JUnit 5 (테스트 실행 엔진) ──────────────────────────
import com.ssafy.be.domain.notification.exception.NotificationErrorCode;
import com.ssafy.be.domain.notification.model.Notification;
import com.ssafy.be.global.sse.enums.SseEventType;
import com.ssafy.be.global.sse.service.SseEmitterService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;

// ── Mockito (Mock 객체 생성 + 검증) ────────────────────
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

// ── AssertJ (값 검증) ───────────────────────────────────
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

// ── SLF4J (로그 출력) ───────────────────────────────────
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// ── 프로젝트 내부 클래스 ────────────────────────────────
import com.ssafy.be.domain.notification.repository.NotificationRepository;
import com.ssafy.be.global.exception.GlobalException;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService 단위 테스트")
class NotificationServiceTest {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceTest.class);

    @InjectMocks
    NotificationService notificationService;
    @Mock
    NotificationRepository notificationRepository;
    @Mock
    SseEmitterService sseEmitterService;

    @BeforeAll
    static void suiteStart() {
        log.info("╔══════════════════════════════════════════════════════╗");
        log.info("║       NotificationService 단위 테스트 시작           ║");
        log.info("╚══════════════════════════════════════════════════════╝");
    }

    @AfterAll
    static void suiteEnd() {
        log.info("╔══════════════════════════════════════════════════════╗");
        log.info("║       NotificationService 단위 테스트 종료           ║");
        log.info("╚══════════════════════════════════════════════════════╝");
    }

    // ═══════════════════════════════════════════════════════
    // 계층 1: 알림 발송
    // ═══════════════════════════════════════════════════════
    @Nested
    @DisplayName("알림 발송 (sendNotification)")
    @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
    class SendNotification {

        @Test
        @Order(1)
        @DisplayName("U-1. Redis 저장 + SSE 전송 각 1회")
        void sendNotification_success() {
            log.info("  [요청] userId=1, type=PURCHASE, title=구매 완료");
            log.info("  [진행] notificationService.sendNotification() 호출");

            notificationService.sendNotification(
                    1L, "PURCHASE", "구매 완료", "상품이 결제되었습니다.", "/orders/1"
            );

            verify(notificationRepository, times(1)).save(any(Notification.class));
            log.info("  [결과] ✔ Redis 저장 1회 확인");

            verify(sseEmitterService, times(1))
                    .sendToClient(eq(SseEventType.NOTIFICATION), eq(1L), any());
            log.info("  [결과] ✔ SSE 전송 1회 확인");
            log.info("  [해소] 저장 + 실시간 전송 동시 보장");
        }
    }

    // ═══════════════════════════════════════════════════════
    // 계층 2: 단건 읽음 처리
    // ═══════════════════════════════════════════════════════
    @Nested
    @DisplayName("단건 읽음 처리 (readNotification)")
    @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
    class ReadNotification {

        @Test
        @Order(1)
        @DisplayName("U-2. 알림 없음 → NOTI-001 예외")
        void readNotification_notFound() {
            log.info("  [요청] userId=1, notificationId=999 (존재하지 않는 알림)");
            log.info("  [준비] findById(999) → null Mock 설정");
            given(notificationRepository.findById(999L)).willReturn(null);

            log.info("  [진행] readNotification(1L, 999L) 호출");
            log.info("  [기대] NOTIFICATION_NOT_FOUND(NOTI-001) 예외 발생");
            assertThatThrownBy(() -> notificationService.readNotification(1L, 999L))
                    .isInstanceOf(GlobalException.class)
                    .satisfies(e -> {
                        assertThat(((GlobalException) e).getErrorCode())
                                .isEqualTo(NotificationErrorCode.NOTIFICATION_NOT_FOUND);
                        log.info("  [결과] ✔ ErrorCode = {} 확인",
                                ((GlobalException) e).getErrorCode());
                    });
            log.info("  [해소] 없는 알림 접근 시 NOTI-001로 거부 보장");
        }

        @Test
        @Order(2)
        @DisplayName("U-3. 타인 알림 접근 → NOTI-002 예외")
        void readNotification_unauthorized() {
            log.info("  [요청] 접근자 userId=1, 알림 소유자 userId=2 (타인 알림)");
            Notification noti = Notification.builder()
                    .id(1L).userId(2L).isRead(false).build();
            log.info("  [준비] findById(1) → Notification(owner=2L) Mock 설정");
            given(notificationRepository.findById(1L)).willReturn(noti);

            log.info("  [진행] readNotification(접근자=1L, notificationId=1L) 호출");
            log.info("  [기대] UNAUTHORIZED_READ(NOTI-002) 예외 발생");
            assertThatThrownBy(() -> notificationService.readNotification(1L, 1L))
                    .isInstanceOf(GlobalException.class)
                    .satisfies(e -> {
                        assertThat(((GlobalException) e).getErrorCode())
                                .isEqualTo(NotificationErrorCode.UNAUTHORIZED_READ);
                        log.info("  [결과] ✔ ErrorCode = {} 확인",
                                ((GlobalException) e).getErrorCode());
                    });
            log.info("  [해소] 타인 알림 접근 시 NOTI-002로 거부 보장");
        }
    }

    // ═══════════════════════════════════════════════════════
    // 계층 3: 전체 읽음 처리
    // ═══════════════════════════════════════════════════════
    @Nested
    @DisplayName("전체 읽음 처리 (readAllNotifications)")
    @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
    class ReadAllNotifications {

        @Test
        @Order(1)
        @DisplayName("U-4. 안읽은 0개 → markAllAsRead 미호출, 0 반환")
        void readAll_whenEmpty() {
            log.info("  [요청] userId=1 전체 읽음 처리");
            log.info("  [준비] getUnreadCount(1) → 0 Mock 설정");
            given(notificationRepository.getUnreadCount(1L)).willReturn(0);

            log.info("  [진행] readAllNotifications(1L) 호출");
            int result = notificationService.readAllNotifications(1L);

            log.info("  [결과] 반환값 = {} (기대: 0)", result);
            assertThat(result).isEqualTo(0);
            verify(notificationRepository, never()).markAllAsRead(any());
            log.info("  [결과] ✔ markAllAsRead 미호출 확인");
            log.info("  [해소] 불필요한 Redis write 없이 early return 보장");
        }

        @Test
        @Order(2)
        @DisplayName("U-5. 안읽은 있음 → markAllAsRead 1회, 개수 반환")
        void readAll_whenExists() {
            log.info("  [요청] userId=1 전체 읽음 처리");
            log.info("  [준비] getUnreadCount(1) → 5 Mock 설정");
            given(notificationRepository.getUnreadCount(1L)).willReturn(5);

            log.info("  [진행] readAllNotifications(1L) 호출");
            int result = notificationService.readAllNotifications(1L);

            log.info("  [결과] 반환값 = {} (기대: 5)", result);
            assertThat(result).isEqualTo(5);
            verify(notificationRepository, times(1)).markAllAsRead(1L);
            log.info("  [결과] ✔ markAllAsRead 1회 호출 확인");
            log.info("  [해소] 안읽은 알림 일괄 처리 및 처리 건수 반환 보장");
        }
    }
}
