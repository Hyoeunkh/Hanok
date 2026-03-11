package com.ssafy.be.domain.stream.dto.response;

import com.ssafy.be.domain.seller.entity.Seller;

public record StreamSellerResponse(
        Long sellerId,
        String nickname,
        String profileImageUri
) {
    public static StreamSellerResponse from(Seller seller) {
        return new StreamSellerResponse(
                seller.getId(),
                seller.getUser().getNickname(),
                seller.getUser().getProfileImage()
        );
    }
}