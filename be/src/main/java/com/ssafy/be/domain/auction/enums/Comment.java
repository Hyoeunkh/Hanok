package com.ssafy.be.domain.auction.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Comment {
    AUCTION_START("\uD83C\uDFC1경매가 시작됐습니다!"), // 🏁경매가 시작됐습니다!
    BID_PLACE("\uD83D\uDE80 %s 님이 %d원 입찰했습니다!") // 🚀 {닉네임} 님이 {금액}원 입찰했습니다!
    ;

    private final String value;
}

