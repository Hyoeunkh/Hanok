import SellerControlBar from './SellerControlBar';
import BuyerControlBar from './BuyerControlBar';
import type { BidSyncPayload } from '@/types';

interface Props {
  isSeller: boolean;
  bidSync: BidSyncPayload | null;
  activeBidAuctionId: number | null;
  introduceAuctionId: number | null;
  startAuctionId: number | null;
  canIntroduce: boolean;
  canStart: boolean;
  isStreamLive: boolean;
  isStartingStream: boolean;
  onStartStream: () => void;
}

export default function ControlBar({
  isSeller,
  bidSync,
  activeBidAuctionId,
  introduceAuctionId,
  startAuctionId,
  canIntroduce,
  canStart,
  isStreamLive,
  isStartingStream,
  onStartStream,
}: Props) {
  return isSeller ? (
    <SellerControlBar
      introduceAuctionId={introduceAuctionId}
      startAuctionId={startAuctionId}
      canIntroduce={canIntroduce}
      canStart={canStart}
      isStreamLive={isStreamLive}
      isStartingStream={isStartingStream}
      onStartStream={onStartStream}
    />
  ) : (
    <BuyerControlBar bidSync={bidSync} activeAuctionId={activeBidAuctionId} />
  );
}
