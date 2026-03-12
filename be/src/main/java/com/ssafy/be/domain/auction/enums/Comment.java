package com.ssafy.be.domain.auction.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Comment {
    AUCTION_START("\uD83C\uDFC1경매가 시작됐습니다!"), // 🏁경매가 시작됐습니다!
    ;

    private final String value;
}
