package com.ssafy.be.domain.user.dto.response;

import com.ssafy.be.domain.user.entity.User;

public record UserProfileResponse(
        String email,
        String nickname,
        String profileImage,
        String phone,
        Long balance,
        Long depositedBalance
) {
    public static UserProfileResponse fromEntity(User user) {
        return new UserProfileResponse(
                user.getEmail(),
                user.getNickname(),
                user.getProfileImage(),
                user.getPhone(),
                user.getBalance(),
                user.getDepositedBidBalance()
                        + user.getDepositedEscrowBalance()
                        + user.getDepositedWithdrawBalance()
        );
    }
}