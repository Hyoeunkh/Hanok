package com.ssafy.be.global.portone;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.be.domain.user.exception.UserErrorCode;
import com.ssafy.be.global.exception.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

// [PortOne API Client]
// PortOne V2 API 호출을 담당하는 컴포넌트
// identityVerificationId로 본인인증 결과 조회
@Component
@RequiredArgsConstructor
public class PortOneClient {

    @Value("${portone.api-secret}")
    private String apiSecret;

    private final ObjectMapper objectMapper;

    private static final String PORTONE_API_URL = "https://api.portone.io";

    public JsonNode getIdentityVerification(String identityVerificationId) {
        try (HttpClient client = HttpClient.newHttpClient()) {  // try-with-resources
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(PORTONE_API_URL + "/identity-verifications/"
                            + identityVerificationId))
                    .header("Authorization", "PortOne " + apiSecret)
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            return objectMapper.readTree(response.body());

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();  // interrupt 복원
            throw new GlobalException(UserErrorCode.IDENTITY_VERIFICATION_FAILED);
        } catch (IOException e) {
            throw new GlobalException(UserErrorCode.IDENTITY_VERIFICATION_FAILED);
        }
    }
}