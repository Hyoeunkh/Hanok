import SellerControlBar from './SellerControlBar';
import BuyerControlBar from './BuyerControlBar';
import type { BidSyncPayload, ItemSyncAuctionStatus } from '@/types';

interface Props {
  isSeller: boolean;
  bidSync: BidSyncPayload | null;
  currentAuctionId: number | null;
  currentAuctionStatus: ItemSyncAuctionStatus | null;
}

export default function ControlBar({ isSeller, bidSync, currentAuctionId, currentAuctionStatus }: Props) {
  return isSeller ? (
    <SellerControlBar currentAuctionId={currentAuctionId} currentAuctionStatus={currentAuctionStatus} />
  ) : (
    <BuyerControlBar bidSync={bidSync} />
  );
}
