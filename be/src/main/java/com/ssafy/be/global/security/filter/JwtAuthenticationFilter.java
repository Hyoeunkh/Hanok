package com.ssafy.be.global.security.filter;

import com.ssafy.be.global.infra.redis.RedisService;
import com.ssafy.be.global.security.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final RedisService redisService;

    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = jwtUtil.resolveToken(request);

        if (token != null) {
            System.out.println("1. 토큰 추출 성공");

            try {
                // Redis 체크
                if (redisService.exists(BLACKLIST_PREFIX + token)) {
                    System.out.println("2. 블랙리스트에 등록된 토큰입니다.");
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
                System.out.println("3. Redis 블랙리스트 검사 통과");

                // 토큰 검증
                Claims claims = jwtUtil.validateToken(token);
                System.out.println("4. 토큰 검증 성공! 사용자 ID: " + claims.getSubject());

                // 권한 세팅 및 인증 객체 생성
                String role = claims.get("role", String.class);
                String authority = (role != null && role.startsWith("ROLE_")) ? role : "ROLE_" + role;

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                claims.getSubject(),
                                null,
                                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(authority))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("5. SecurityContext 등록 완료: " + SecurityContextHolder.getContext().getAuthentication().isAuthenticated());

            } catch (Exception e) {
                System.err.println("토큰 처리 중 치명적 에러 발생: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                e.printStackTrace();
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("들어온 토큰이 없습니다. (null)");
        }

        filterChain.doFilter(request, response);
    }
}