package com.ssafy.be.domain.stream.service;

import com.ssafy.be.domain.seller.entity.Seller;
import com.ssafy.be.domain.seller.exception.SellerErrorCode;
import com.ssafy.be.domain.seller.repository.SellerRepository;
import com.ssafy.be.domain.stream.dto.request.StreamRegisterRequest;
import com.ssafy.be.domain.stream.dto.request.StreamUpdateRequest;
import com.ssafy.be.domain.stream.dto.response.StreamRegisterResponse;
import com.ssafy.be.domain.stream.entity.Stream;
import com.ssafy.be.domain.stream.exception.StreamErrorCode;
import com.ssafy.be.domain.stream.repository.StreamRepository;
import com.ssafy.be.global.exception.GlobalException;
import com.ssafy.be.global.infra.gcs.GcsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class StreamService {

    private final StreamRepository streamRepository;
    private final SellerRepository sellerRepository;
    private final GcsClient gcsClient;

    @Transactional
    public StreamRegisterResponse register(Long userId, StreamRegisterRequest request, MultipartFile thumbnail) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new GlobalException(SellerErrorCode.SELLER_NOT_FOUND));

        Stream saved = streamRepository.save(buildStream(request, seller));

        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String url = gcsClient.uploadStreamThumbnail(thumbnail, seller.getId(), saved.getId());
                saved.updateThumbnail(url);
            } catch (IOException e) {
                throw new GlobalException(StreamErrorCode.THUMBNAIL_UPLOAD_FAILED);
            }
        }

        return new StreamRegisterResponse(saved.getId(), saved.getTitle(), saved.getStartType());
    }

    private Stream buildStream(StreamRegisterRequest request, Seller seller) {
        return Stream.builder()
                .title(request.title())
                .category(request.category())
                .startType(request.startType())
                .scheduledAt(request.scheduledAt())
                .notice(request.notice())
                .isLive(false)
                .seller(seller)
                .build();
    }

    @Transactional
    public StreamRegisterResponse updateStream(Long userId, Long streamId, StreamUpdateRequest request, MultipartFile thumbnail) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new GlobalException(SellerErrorCode.SELLER_NOT_FOUND));

        Stream stream = streamRepository.findByIdAndSellerId(streamId, seller.getId())
                .orElseThrow(() -> new GlobalException(StreamErrorCode.STREAM_NOT_FOUND));

        stream.update(request.title(), request.category(), request.startType(),
                request.scheduledAt(), request.notice());

        if (thumbnail != null && !thumbnail.isEmpty()) {
            if (stream.getThumbnail() != null) {
                gcsClient.deleteStreamThumbnail(stream.getThumbnail());
            }
            try {
                String url = gcsClient.uploadStreamThumbnail(thumbnail, seller.getId(), streamId);
                stream.updateThumbnail(url);
            } catch (IOException e) {
                throw new GlobalException(StreamErrorCode.THUMBNAIL_UPLOAD_FAILED);
            }
        }

        return new StreamRegisterResponse(stream.getId(), stream.getTitle(), stream.getStartType());
    }

    @Transactional
    public void deleteStream(Long userId, Long streamId) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new GlobalException(SellerErrorCode.SELLER_NOT_FOUND));

        Stream stream = streamRepository.findByIdAndSellerId(streamId, seller.getId())
                .orElseThrow(() -> new GlobalException(StreamErrorCode.STREAM_NOT_FOUND));

        if (stream.getThumbnail() != null) {
            gcsClient.deleteStreamThumbnail(stream.getThumbnail());
        }

        streamRepository.delete(stream);
    }
}