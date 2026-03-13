package com.ssafy.be.domain.escrow.controller;

import com.ssafy.be.domain.escrow.api.EscrowApi;
import com.ssafy.be.domain.escrow.dto.EscrowCancelRequest;
import com.ssafy.be.domain.escrow.dto.TrackingNumberRegisterRequest;
import com.ssafy.be.domain.escrow.service.EscrowService;
import com.ssafy.be.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/v1/escrows")
@RestController
public class EscrowController implements EscrowApi {
    private final EscrowService escrowService;

    @PostMapping("/{escrowId}/tracking")
    public ResponseEntity<?> registerTrackingNumber(
            @RequestBody @Valid TrackingNumberRegisterRequest request,
            @PathVariable Long escrowId,
            @AuthenticationPrincipal String principal
    ) {
        escrowService.registerTrackingNumber(request, escrowId, getUserId(principal));
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/{escrowId}/cancel")
    public ResponseEntity<?> cancelEscrow(
            @RequestBody @Valid EscrowCancelRequest request,
            @PathVariable Long escrowId,
            @AuthenticationPrincipal String principal) {
        escrowService.cancelEscrow(request, escrowId, getUserId(principal));
        return ResponseEntity.ok(ApiResponse.success());
    }

    private Long getUserId(String principal) {
        return Long.parseLong(principal);
    }
}
