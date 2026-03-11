package com.ssafy.be.domain.stream.dto.response;

import com.ssafy.be.domain.item.entity.Category;
import com.ssafy.be.domain.stream.entity.Stream;
import java.time.LocalDateTime;

public record StreamListItemResponse(
        Long streamId,
        String title,
        Category category,
        String thumbnailUri,
        boolean isLive,
        long viewerCount,
        LocalDateTime scheduledAt,
        LocalDateTime startedAt,
        StreamSellerResponse seller) {
    public static StreamListItemResponse of(Stream stream, long viewerCount) {
        return new StreamListItemResponse(
                stream.getId(),
                stream.getTitle(),
                stream.getCategory(),
                stream.getThumbnail(),
                stream.isLive(),
                viewerCount,
                stream.getScheduledAt(),
                stream.getStartedAt(),
                StreamSellerResponse.from(stream.getSeller()));
    }
}
