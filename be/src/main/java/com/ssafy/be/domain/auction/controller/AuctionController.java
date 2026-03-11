package com.ssafy.be.domain.auction.controller;

import com.ssafy.be.domain.auction.dto.request.BidPlaceRequest;
import com.ssafy.be.domain.auction.dto.response.BidPlaceResponse;
import com.ssafy.be.domain.auction.service.AuctionService;
import com.ssafy.be.domain.auction.dto.request.AuctionStartRequest;
import com.ssafy.be.domain.auction.dto.response.AuctionStartResponse;
import com.ssafy.be.global.common.response.JsonConverter;
import com.ssafy.be.global.websocket.dto.request.StompRequest;
import com.ssafy.be.global.websocket.dto.response.StompResponse;
import com.ssafy.be.global.websocket.enums.StompType;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.security.Principal;

import static com.ssafy.be.global.websocket.enums.StompType.AUCTION_START;
import static com.ssafy.be.global.websocket.enums.StompType.BID_PLACED;

@RequiredArgsConstructor
@Controller
public class AuctionController {
    private final AuctionService auctionService;
    private final JsonConverter jsonConverter;
    private final SimpMessageSendingOperations messageTemplate;

    @MessageMapping("/streams/{streamId}")
    public void startAuction(
            @DestinationVariable Long streamId,
            @Payload StompRequest request,
            Principal principal
    ) {
        switch (request.getEventType()) {
            case AUCTION_START -> {
                AuctionStartResponse payload = auctionService.startAuction(
                        jsonConverter.convert(request.getPayload(), AuctionStartRequest.class),
                        streamId,
                        Long.parseLong(principal.getName())
                );

                StompResponse<Object> response = buildStompResponse(AUCTION_START, payload);

                messageTemplate.convertAndSend("/broadcast/streams/" + streamId, response);
            }

            case BID_PLACED -> {
                BidPlaceResponse payload = auctionService.placeBid(
                        jsonConverter.convert(request.getPayload(), BidPlaceRequest.class),
                        streamId,
                        Long.parseLong(principal.getName())
                );

                StompResponse<Object> response = buildStompResponse(BID_PLACED, payload);

                messageTemplate.convertAndSend("/broadcast/streams/" + streamId, response);
            }

        }
    }

    private static StompResponse<Object> buildStompResponse(StompType stompType, Object payload) {
        return StompResponse.builder()
                .eventType(stompType)
                .payload(payload)
                .build();
    }

}
