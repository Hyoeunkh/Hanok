import type { AuctionDuration, SellerGrade } from "@/types";

export const DURATION_OPTIONS: Record<SellerGrade, AuctionDuration[]> = {
  General: [10, 30, 60],
  MVP: [10, 30, 60, 600],
};

export const DURATION_LABELS: Record<AuctionDuration, string> = {
  10: "10초",
  30: "30초",
  60: "1분",
  600: "10분",
};

export const TIMER_EXTENSION_SECONDS = 10;

export const TIMER_URGENT_THRESHOLD = TIMER_EXTENSION_SECONDS;
