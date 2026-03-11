package com.ssafy.be.domain.stream.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StreamViewerService {

    private static final String VIEWER_COUNT_KEY = "stream:viewerCount:";
    private final RedisTemplate<String, String> redisTemplate;

    public void increment(Long streamId) {
        redisTemplate.opsForValue().increment(VIEWER_COUNT_KEY + streamId);
    }

    public void decrement(Long streamId) {
        redisTemplate.opsForValue().decrement(VIEWER_COUNT_KEY + streamId);
    }

    public long getViewerCount(Long streamId) {
        String value = redisTemplate.opsForValue().get(VIEWER_COUNT_KEY + streamId);
        return value == null ? 0L : Long.parseLong(value);
    }
}
