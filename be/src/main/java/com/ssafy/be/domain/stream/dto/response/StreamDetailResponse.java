package com.ssafy.be.domain.stream.dto.response;

import com.ssafy.be.domain.item.entity.Category;
import com.ssafy.be.domain.stream.entity.StartType;
import com.ssafy.be.domain.stream.entity.Stream;

import java.time.LocalDateTime;

public record StreamDetailResponse(
        Long streamId,
        String title,
        Category category,
        String thumbnail,
        LocalDateTime scheduledAt,
        StartType startType,
        String notice,
        boolean isLive,
        LocalDateTime createdAt
) {
    public static StreamDetailResponse from(Stream stream) {
        return new StreamDetailResponse(
                stream.getId(),
                stream.getTitle(),
                stream.getCategory(),
                stream.getThumbnail(),
                stream.getScheduledAt(),
                stream.getStartType(),
                stream.getNotice(),
                stream.isLive(),
                stream.getCreatedAt()
        );
    }
}