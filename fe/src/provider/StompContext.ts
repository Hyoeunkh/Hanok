import { createContext } from 'react';
import type { Client } from '@stomp/stompjs';

export type StompConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface StompContextValue {
  client: Client | null;
  connectionState: StompConnectionState;
  streamId: number;
}

export const StompContext = createContext<StompContextValue | null>(null);
