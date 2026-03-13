package com.ssafy.be.domain.escrow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record EscrowCancelRequest(
        @NotNull Long escrowId,
        @NotBlank String cancelReason
) {
}
