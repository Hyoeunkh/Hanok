import { useMemo } from 'react';

import type { EscrowItem, EscrowState } from '@/types';

export type EscrowActor = 'buyer' | 'seller';

export const isEscrowPending = (state: EscrowState) => state === 'DEPOSITED';
export const isEscrowTrackingSubmitted = (state: EscrowState) => state === 'SHIPPED' || state === 'COMPLETED';
export const isEscrowCancelled = (state: EscrowState) => state === 'CANCELLED';

export const canSubmitTracking = (state: EscrowState) => state === 'DEPOSITED';
export const canCancelEscrow = (state: EscrowState) => state === 'DEPOSITED';
export const canCompleteEscrow = (state: EscrowState) => state === 'SHIPPED';
export const canOpenNftReceipt = (state: EscrowState) => state === 'COMPLETED';

export function useEscrowActions(selectedEscrow: EscrowItem | null, actor: EscrowActor) {
  return useMemo(() => {
    const status = selectedEscrow?.escrowStatus ?? null;

    return {
      status,
      canSubmitTracking: actor === 'seller' && status !== null ? canSubmitTracking(status) : false,
      canCancelEscrow: actor === 'seller' && status !== null ? canCancelEscrow(status) : false,
      canCompleteEscrow: actor === 'buyer' && status !== null ? canCompleteEscrow(status) : false,
      canOpenNftReceipt: actor === 'buyer' && status !== null ? canOpenNftReceipt(status) : false,
      isPending: status !== null ? isEscrowPending(status) : false,
      isTrackingSubmitted: status !== null ? isEscrowTrackingSubmitted(status) : false,
      isCancelled: status !== null ? isEscrowCancelled(status) : false,
    };
  }, [actor, selectedEscrow]);
}
