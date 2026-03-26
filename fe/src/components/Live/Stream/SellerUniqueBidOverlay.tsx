import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import coinImage from '@/assets/coin.png';

type SellerUniqueBidOverlayProps = {
  participantCount: number;
};

type CoinDrop = {
  id: number;
  left: number;
  size: number;
  driftRotate: number;
  spinStart: number;
  spinEnd: number;
  duration: number;
  delay: number;
};

const OVERLAY_DURATION_MS = 1900;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const buildCoinDrops = (startId: number, count: number): CoinDrop[] =>
  Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    left: randomBetween(4, 96),
    size: randomBetween(18, 30),
    driftRotate: randomBetween(-28, 28),
    spinStart: randomBetween(-120, 120),
    spinEnd: randomBetween(360, 1080) * (Math.random() > 0.5 ? 1 : -1),
    duration: randomBetween(0.95, 1.5),
    delay: index * randomBetween(0.05, 0.09),
  }));

export default function SellerUniqueBidOverlay({ participantCount }: SellerUniqueBidOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coins, setCoins] = useState<CoinDrop[]>([]);

  const nextCoinIdRef = useRef(1);
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

  useEffect(() => clearTrackedTimers, [clearTrackedTimers]);

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

    clearTrackedTimers();

    const delta = participantCount - previousCount;
    const nextCoins = buildCoinDrops(nextCoinIdRef.current, Math.min(22, 8 + delta * 3));
    nextCoinIdRef.current += nextCoins.length;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      setCoins(nextCoins);
      setIsVisible(true);
    });

    const hideOverlayTimeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, OVERLAY_DURATION_MS);

    const clearCoinsTimeoutId = window.setTimeout(() => {
      setCoins([]);
    }, OVERLAY_DURATION_MS + 220);

    cleanupTimeoutsRef.current.push(hideOverlayTimeoutId, clearCoinsTimeoutId);
  }, [clearTrackedTimers, participantCount]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-0 z-10"
        >
          <AnimatePresence>
            {coins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ y: '-10vh', opacity: 0, rotate: 0, scale: 0.88 }}
                animate={{
                  y: '112vh',
                  opacity: [0, 1, 1, 0],
                  rotate: coin.driftRotate,
                  scale: [0.88, 1, 0.98],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: coin.duration,
                  delay: coin.delay,
                  ease: 'easeIn',
                }}
                style={{
                  left: `${coin.left}%`,
                  width: `${coin.size}px`,
                  height: `${coin.size}px`,
                }}
                className="absolute top-[-40px] -translate-x-1/2 drop-shadow-[0_12px_28px_rgba(235,184,64,0.24)]"
              >
                <motion.img
                  src={coinImage}
                  alt=""
                  draggable={false}
                  initial={{ rotate: coin.spinStart }}
                  animate={{ rotate: coin.spinEnd }}
                  transition={{
                    duration: coin.duration,
                    delay: coin.delay,
                    ease: 'linear',
                  }}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
