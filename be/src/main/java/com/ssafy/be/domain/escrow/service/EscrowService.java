package com.ssafy.be.domain.escrow.service;

import com.ssafy.be.domain.auction.entity.Auction;
import com.ssafy.be.domain.auction.model.Bid;
import com.ssafy.be.domain.escrow.dto.TrackingNumberRegisterRequest;
import com.ssafy.be.domain.escrow.entity.Escrow;
import com.ssafy.be.domain.escrow.exception.EscorwErrorCode;
import com.ssafy.be.domain.escrow.repository.EscrowRepository;
import com.ssafy.be.domain.shippingaddress.entity.ShippingAddress;
import com.ssafy.be.domain.user.entity.User;
import com.ssafy.be.domain.user.exception.UserErrorCode;
import com.ssafy.be.domain.user.repository.UserRepository;
import com.ssafy.be.global.exception.GlobalException;
import com.ssafy.be.global.websocket.exception.StompException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com.ssafy.be.domain.escrow.entity.EscrowStatus.DEPOSITED;

@RequiredArgsConstructor
@Service
public class EscrowService {
    public static final double FEE_RATE = 0.05;
    private final EscrowRepository escrowRepository;
    private final UserRepository userRepository;

    public void startEscrow(Bid topBid, Auction auction, ShippingAddress shippingAddress) {
        User buyer = userRepository.findById(topBid.userId())
                .orElseThrow(() -> new StompException(UserErrorCode.USER_NOT_FOUND));

        buyer.depositEscrowBalance(topBid.amount());

        Escrow escrow = Escrow.builder()
                .winningPrice(topBid.amount())
                .feeAmount(calculateFeeAmount(topBid))
                .escrowStatus(DEPOSITED)
                .auction(auction)
                .buyer(buyer)
                .seller(auction.getStream().getSeller())
                .shippingAddress(shippingAddress)
                .build();

        escrowRepository.save(escrow);

        // TODO: 거래내역 생성
    }

    @Transactional
    public void registerTrackingNumber(TrackingNumberRegisterRequest request, Long escrowId, Long userId) {
        Escrow escrow = escrowRepository.findById(escrowId)
                .orElseThrow(() -> new GlobalException(EscorwErrorCode.ESCROW_NOT_FOUND));

        // 판매자인지 확인
        validateSeller(escrow, userId);

        // 우송장 번호 등로 가능한 에스크로 상태인지 확인
        validateAvailableRegisterTrackingNumber(escrow);

        escrow.registerTrackingNumber(request.carrierName(), request.trackingNumber(), LocalDateTime.now());
    }

    private static long calculateFeeAmount(Bid topBid) {
        return (long) (topBid.amount() * FEE_RATE);
    }

    private void validateSeller(Escrow escrow, Long userId) {
        if (!escrow.isEscrowSeller(userId)) {
            throw new GlobalException(EscorwErrorCode.ESCROW_NOT_SELLER);
        }
    }

    private void validateAvailableRegisterTrackingNumber(Escrow escrow) {
        if (!escrow.isAvailableRegisterTrackingNumber()) {
            throw new GlobalException(EscorwErrorCode.ESCROW_NOT_SELLER);
        }
    }
}

