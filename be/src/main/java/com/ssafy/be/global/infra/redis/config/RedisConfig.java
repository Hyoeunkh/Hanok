package com.ssafy.be.global.infra.redis.config;


import com.google.api.client.util.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String host;

    @Value("${spring.data.redis.port:6379}")
    private int port;

    /*
     * Standalone 단일 노드
     * Sentinel 마스터-슬레이브 + 장애 감지 자동화
     * Cluster 클러스터
     * */

    // layer-1 lettuce 커넥션
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//        return new LettuceConnectionFactory(
//                new RedisStandaloneConfiguration(host, port)
//        );
//    }

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        String safeHost = (host == null || host.isBlank()) ? "localhost" : host;

        int safePort = (port == 0) ? 6379 : port;

        return new LettuceConnectionFactory(
                new RedisStandaloneConfiguration(safeHost, safePort)
        );
    }


    // layer-2 StringRedisTemplate
    // factory는 connection 자체 소유 x, 참조 주입 = 결국 단일 factory 사용
    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }


}
