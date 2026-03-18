import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getStompConnectionState,
  subscribeStream,
  subscribeToStompConnectionState,
  type StompConnectionState,
} from '@/websocket/stompClient';

export function useStompViewerCount() {
  const { id: streamIdParam } = useParams<{ id: string }>();
  const streamId = streamIdParam ?? '';
  const [viewerCount, setViewerCount] = useState(0);
  const [connectionState, setConnectionState] = useState<StompConnectionState>(getStompConnectionState());

  useEffect(() => {
    return subscribeToStompConnectionState(setConnectionState);
  }, []);

  useEffect(() => {
    if (!streamId) {
      return;
    }

    let isDisposed = false;
    let unsubscribe: (() => void) | null = null;

    void subscribeStream<{ eventType?: string; payload?: unknown }>({
      streamId,
      onBroadcast: (response) => {
        console.log('[viewer-count] broadcast:', response.eventType, response.payload);
        if (response.eventType !== 'VIEWER_COUNT') {
          return;
        }

        const raw = response.payload;
        const count =
          typeof raw === 'number'
            ? raw
            : typeof raw === 'object' && raw !== null && 'count' in raw && typeof (raw as { count: unknown }).count === 'number'
              ? (raw as { count: number }).count
              : 0;
        setViewerCount(count);
      },
    })
      .then((cleanup) => {
        if (isDisposed) {
          cleanup();
          return;
        }

        unsubscribe = cleanup;
      })
      .catch((error) => {
        console.error('[viewer-count] failed to subscribe', error);
      });

    return () => {
      isDisposed = true;
      unsubscribe?.();
    };
  }, [streamId]);

  return { viewerCount, connectionState };
}
