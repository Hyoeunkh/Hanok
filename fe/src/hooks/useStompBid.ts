import { useCallback, useEffect, useRef, useState } from 'react';
import { useStomp } from './useStomp';
import { DESTINATION_PREFIX, MAX_BID_HISTORY } from '@/constants/stomp';
import type {
  StompResponse,
  BidPlacePayload,
  BidEntry,
  TopBidder,
} from '@/types/stomp';

export function useStompBid() {
  const { client, connectionState, streamId } = useStomp();
  const [bids, setBids] = useState<BidEntry[]>([]);
  const [topBidders, setTopBidders] = useState<TopBidder[]>([]);
  const subRef = useRef<{ unsubscribe: () => void } | null>(null);

  const currentHighBid = bids.length > 0
    ? Math.max(...bids.map((b) => b.amount))
    : 0;

  useEffect(() => {
    if (connectionState !== 'connected' || !client) return;

    const destination = `${DESTINATION_PREFIX.BROADCAST}/stream/${streamId}/bid`;

    subRef.current = client.subscribe(destination, (frame) => {
      const res: StompResponse<unknown> = JSON.parse(frame.body);

      switch (res.eventType) {
        case 'BID_PLACED': {
          const entry = res.payload as BidEntry;
          setBids((prev) => {
            const next = [...prev, entry];
            return next.length > MAX_BID_HISTORY
              ? next.slice(next.length - MAX_BID_HISTORY)
              : next;
          });
          break;
        }
        case 'BID_WINNER': {
          const winners = res.payload as TopBidder[];
          setTopBidders(winners);
          break;
        }
      }
    });

    return () => {
      subRef.current?.unsubscribe();
      subRef.current = null;
    };
  }, [client, connectionState, streamId]);

  const placeBid = useCallback(
    (amount: number) => {
      if (!client || connectionState !== 'connected') return;
      const body: BidPlacePayload = { amount };
      client.publish({
        destination: `${DESTINATION_PREFIX.APP}/stream/${streamId}/bid`,
        body: JSON.stringify({ eventType: 'BID_PLACED', payload: body }),
      });
    },
    [client, connectionState, streamId],
  );

  return { bids, topBidders, currentHighBid, placeBid };
}
