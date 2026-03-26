import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

type SellerUniqueBidOverlayProps = {
  participantCount: number;
  className?: string;
};

type MoneyDrop = {
  id: number;
  left: number;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
};

const buildMoneyDrops = (startId: number, count: number): MoneyDrop[] =>
  Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    left: 10 + ((index * 13) % 78),
    size: 28 + ((index * 5) % 10),
    rotate: -18 + ((index * 11) % 36),
    duration: 0.72 + (index % 3) * 0.12,
    delay: (index % 4) * 0.04,
  }));

export default function SellerUniqueBidOverlay({ participantCount, className = '' }: SellerUniqueBidOverlayProps) {
  const [drops, setDrops] = useState<MoneyDrop[]>([]);
  const [pulseKey, setPulseKey] = useState(0);

  const nextDropIdRef = useRef(1);
  const previousCountRef = useRef<number | null>(null);
  const cleanupTimeoutsRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const clearTrackedTimers = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    cleanupTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    cleanupTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return clearTrackedTimers;
  }, [clearTrackedTimers]);

  useEffect(() => {
    if (previousCountRef.current === null) {
      previousCountRef.current = participantCount;
      return;
    }

    const previousCount = previousCountRef.current;
    previousCountRef.current = participantCount;

    if (participantCount <= previousCount) {
      return;
    }

    const delta = participantCount - previousCount;
    const nextDrops = buildMoneyDrops(nextDropIdRef.current, Math.min(8, 5 + delta));

    nextDropIdRef.current += nextDrops.length;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      setPulseKey((current) => current + 1);
      setDrops((current) => [...current, ...nextDrops]);
    });
  }, [participantCount]);

  return (
    <div className={`pointer-events-none relative w-[10.75rem] shrink-0 sm:w-[11.75rem] ${className}`}>
      <motion.div
        key={pulseKey}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-(--radius-panel) border border-gold/12 bg-surface/82 text-neutral-100 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,196,120,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(151,111,55,0.24),transparent_42%)]" />

        <div className="relative px-3.5 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/12 bg-gold/[0.08] px-2.5 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-light">입찰 수</span>
            </div>
            <FiTrendingUp className="h-4 w-4 text-gold-light/80" />
          </div>

          <div className="relative mt-3 h-20 overflow-hidden rounded-2xl border border-white/6 bg-black/18">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-gold/40 via-gold-light/20 to-transparent" />

            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center">
              <div className="mt-1 flex items-end gap-1">
                <span className="text-[28px] leading-none font-black tabular-nums text-white/92">
                  {participantCount.toLocaleString('ko-KR')}
                </span>
                <span className="pb-0.5 text-[12px] font-extrabold text-gold-light/80">명</span>
              </div>
            </div>

            <AnimatePresence>
              {drops.map((drop) => (
                <motion.div
                  key={drop.id}
                  initial={{ y: -28, opacity: 0, rotate: 0, scale: 0.9 }}
                  animate={{ y: 52, opacity: [0, 1, 1, 0], rotate: drop.rotate, scale: [0.9, 1, 0.96] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: drop.duration, delay: drop.delay, ease: 'easeIn' }}
                  style={{
                    left: `${drop.left}%`,
                    width: `${drop.size}px`,
                    height: `${drop.size}px`,
                  }}
                  className="absolute top-[-18px] z-10 flex -translate-x-1/2 items-center justify-center rounded-[14px] border border-gold/20 bg-[linear-gradient(180deg,rgba(255,221,137,0.95)_0%,rgba(205,145,80,0.95)_100%)] text-[11px] font-black text-background shadow-[0_10px_24px_rgba(205,145,80,0.28)]"
                >
                  $
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
