package com.ssafy.be.domain.user.controller;

import com.ssafy.be.domain.user.service.UserService;
import com.ssafy.be.global.common.response.ApiResponse;
import com.ssafy.be.global.security.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    // -----------------------------------------------
    // 프로필 이미지 업로드
    // PATCH /api/v1/users/me/profile-image
    // -----------------------------------------------
    @Operation(summary = "프로필 이미지 업로드", description = "프로필 이미지를 업로드합니다.")
    @PatchMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(
            @RequestPart("image") MultipartFile file,
            HttpServletRequest request) throws IOException {

        Long userId = jwtUtil.resolveUserId(request);
        String imageUrl = userService.uploadProfileImage(userId, file);

        return ResponseEntity.ok(ApiResponse.success(imageUrl));
    }
}