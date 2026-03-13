package com.ssafy.be.domain.escrow.entity;

import com.ssafy.be.domain.auction.entity.Auction;
import com.ssafy.be.domain.item.entity.Item;
import com.ssafy.be.domain.seller.entity.Seller;
import com.ssafy.be.domain.shippingaddress.entity.ShippingAddress;
import com.ssafy.be.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;

import static com.ssafy.be.domain.escrow.entity.EscrowStatus.DEPOSITED;
import static com.ssafy.be.domain.escrow.entity.EscrowStatus.SHIPPED;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Escrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long winningPrice;

    private Long feeAmount;

    @Enumerated(EnumType.STRING)
    private EscrowStatus escrowStatus;

    private String courierName;

    private String trackingNumber;

    private LocalDateTime submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    @Builder
    private Escrow(Long winningPrice,
                   Long feeAmount,
                   EscrowStatus escrowStatus,
                   String courierName,
                   String trackingNumber,
                   LocalDateTime submittedAt,
                   Auction auction,
                   User buyer,
                   Seller seller,
                   ShippingAddress shippingAddress,
                   LocalDateTime createdAt,
                   LocalDateTime modifiedAt) {
        this.winningPrice = winningPrice;
        this.feeAmount = feeAmount;
        this.escrowStatus = escrowStatus;
        this.courierName = courierName;
        this.trackingNumber = trackingNumber;
        this.submittedAt = submittedAt;
        this.auction = auction;
        this.buyer = buyer;
        this.seller = seller;
        this.shippingAddress = shippingAddress;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }

    public void registerTrackingNumber(String carrierName, String trackingNumber, LocalDateTime submittedAt) {
        if (!isAvailableRegisterTrackingNumber()) {
            throw new IllegalArgumentException("운송장 번호를 등록할 수 있는 에스크로 상태가 아닙니다.");
        }

        this.escrowStatus = SHIPPED;
        this.courierName = carrierName;
        this.trackingNumber = trackingNumber;
        this.submittedAt = submittedAt;
    }

    public boolean isEscrowSeller(Long userId) {
        return Objects.equals(this.seller.getUser().getId(), userId);
    }

    public boolean isAvailableRegisterTrackingNumber() {
        return this.escrowStatus == DEPOSITED;
    }
}
