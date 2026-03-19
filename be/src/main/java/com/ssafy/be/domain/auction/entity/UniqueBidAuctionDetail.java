package com.ssafy.be.domain.auction.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UniqueBidAuctionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Auction과 1:1 관계. Auction 레코드 하나당 detail 하나만 존재해야 하므로 unique = true
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", unique = true)
    private Auction auction;

    private Long minPrice;

    private Long maxPrice;

    @Builder
    public UniqueBidAuctionDetail(Auction auction, Long minPrice, Long maxPrice) {
        this.auction = auction;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }
}
