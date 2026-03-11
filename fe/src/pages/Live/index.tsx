import { useEffect, useState } from 'react';
import { GoHomeFill } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';

import AuctionTimer from '@/components/Live/Auction/shared/AuctionTimer';
import ControlBar from '@/components/Live/Stream/ControlBar';
import SellerGuideOverlay from '@/components/Live/Stream/SellerGuideOverlay';
import StreamOverlay from '@/components/Live/Stream/StreamOverlay';
import StreamPlaceholder from '@/components/Live/Stream/StreamPlaceholder';
import type { StreamTimerPayload, SyncedAuctionTimer } from '@/types';
import { disconnectStompClient, subscribeStream } from '@/websocket/stompClient';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

type StreamEvent =
  | {
      eventType: 'AUCTION_START';
      payload?: {
        timer?: StreamTimerPayload;
      };
    }
  | {
      eventType: 'BID_PLACED';
      payload?: {
        snipingTimer?: StreamTimerPayload | null;
      };
    }
  | {
      eventType: string;
      payload?: unknown;
    };

const isAuctionStartEvent = (
  event: StreamEvent,
): event is Extract<StreamEvent, { eventType: 'AUCTION_START' }> => event.eventType === 'AUCTION_START';

const isBidPlacedEvent = (
  event: StreamEvent,
): event is Extract<StreamEvent, { eventType: 'BID_PLACED' }> => event.eventType === 'BID_PLACED';

const createSyncedTimer = (timer: StreamTimerPayload): SyncedAuctionTimer => ({
  ...timer,
  receivedAtMs: Date.now(),
});

export default function LivePage() {
  const navigate = useNavigate();
  const { id: streamId } = useParams<{ id: string }>();
  const [isSeller, setIsSeller] = useState(true);
  const [timer, setTimer] = useState<SyncedAuctionTimer | null>(null);

  useEffect(() => {
    if (!streamId) {
      return;
    }

    const handleStreamEvent = (event: StreamEvent) => {
      if (isAuctionStartEvent(event) && event.payload?.timer) {
        setTimer(createSyncedTimer(event.payload.timer));
        return;
      }

      if (isBidPlacedEvent(event) && event.payload?.snipingTimer) {
        setTimer(createSyncedTimer(event.payload.snipingTimer));
      }
    };

    let unsubscribeStream: () => void = () => {};

    void subscribeStream<StreamEvent>({
      streamId,
      onBroadcast: handleStreamEvent,
    })
      .then((cleanup) => {
        unsubscribeStream = cleanup;
      })
      .catch((error) => {
        console.error('[stream] failed to subscribe', error);
      });

    return () => {
      unsubscribeStream();
      void disconnectStompClient();
    };
  }, [streamId]);

  return (
    <div className="flex h-screen w-full flex-col bg-black p-3">
      <div className="mb-2 flex shrink-0 items-center">
        <button
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold text-[#71717A] transition hover:bg-[rgba(255,255,255,0.05)] hover:text-[#A1A1AA]"
          onClick={() => navigate('/')}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <GoHomeFill /> 홈으로
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="min-w-0 flex-1">
          <LeftPanel isSeller={isSeller} />
        </div>
        <div className="relative min-w-0 flex-2 overflow-hidden rounded-2xl bg-background">
          <StreamOverlay />
          <SellerGuideOverlay />
          <StreamPlaceholder />
          <ControlBar isSeller={isSeller} />

          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <div className="flex gap-1 rounded-lg bg-[rgba(0,0,0,.6)] p-1">
              <button
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${isSeller ? 'bg-white text-black' : 'text-[#71717a]'}`}
                onClick={() => setIsSeller(true)}
              >
                판매자
              </button>
              <button
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${!isSeller ? 'bg-white text-black' : 'text-[#71717a]'}`}
                onClick={() => setIsSeller(false)}
              >
                구매자
              </button>
            </div>

            {timer && <AuctionTimer key={timer.receivedAtMs} timer={timer} onExpire={() => undefined} />}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <RightPanel isSeller={isSeller} />
        </div>
      </div>
    </div>
  );
}
