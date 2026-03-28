import { useEffect, useRef, useState } from 'react';
import { getItemConditionLabel } from '@/constants/itemCondition';
import prizeImg from '@/assets/prize.png';
import type { WinModalProps } from '@/types/auction';
import { launchConfetti } from '@/utils/confetti';
import winModalEffectSound from '@/assets/Win_Modal_Effect_sound.mp3';

const preloadedWinAudio = new Audio(winModalEffectSound);
preloadedWinAudio.load();

export default function WinModal({
  isOpen,
  itemName,
  itemCond,
  finalPrice,
  address,
  onConfirm,
  layout = 'modal',
  disableConfetti = false,
}: WinModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemConditionLabel = getItemConditionLabel(itemCond);

  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      prevOpenRef.current = false;
      return;
    }

    if (!prevOpenRef.current) {
      prevOpenRef.current = true;
      (preloadedWinAudio.cloneNode(true) as HTMLAudioElement).play().catch(() => { });
    }

    if (disableConfetti) return;

    return launchConfetti(canvasRef.current);
  }, [disableConfetti, isOpen]);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const content = (
    <>
      {!disableConfetti && <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-101" />}

      <div className="relative z-100 w-full max-w-[560px] overflow-hidden rounded-(--radius-panel) border border-gold/25 bg-surface shadow-[0_0_80px_rgba(205,145,80,0.15),0_0_30px_rgba(205,145,80,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(205,145,80,0.12)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(205,145,80,0.06)_0%,transparent_50%)]" />

        <div className="relative flex flex-col items-center gap-3 border-b border-gold/15 bg-[linear-gradient(160deg,rgba(205,145,80,0.14)_0%,rgba(205,145,80,0.03)_50%,transparent_80%)] px-7 py-8 pb-6">
          <img src={prizeImg} alt="축하 트로피" className="h-20 w-20 drop-shadow-[0_0_16px_rgba(205,145,80,0.4)]" />
          <h2 className="text-center text-[22px] font-black text-gold-light">낙찰을 축하드립니다!</h2>
          <p className="text-center text-[14px] text-neutral-400">
            결제가 완료되었습니다. 라이브는 계속 시청 가능합니다.
          </p>
        </div>

        <div className="relative flex flex-col gap-4 px-7 py-6">
          <div className="flex items-center justify-between gap-4 rounded-(--radius-panel) border border-gold/12 bg-gold/[0.04] px-4.5 py-4">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="truncate text-sub-lg font-bold text-warm">{itemName}</p>
              <p className="text-sub-sm text-neutral-500">{itemConditionLabel}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end">
              <span className="text-sub-sm text-neutral-500">낙찰가</span>
              <span className="text-price-lg font-black text-gold-light">{finalPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sub-sm font-extrabold uppercase text-neutral-400">배송지 정보</p>
            <div className="rounded-2xl border border-gold/10 bg-gold/[0.02] px-4 py-3.5">
              <p className="text-sub-sm font-bold leading-[1.6] text-white">
                {address.addressName} ({address.recipientName})
              </p>
              <p className="mt-1.5 break-keep text-sub-sm text-neutral-400">{address.phone}</p>
              <p className="break-keep text-sub-sm text-neutral-400">
                ({address.postalCode}) {address.address} {address.addressDetail}
              </p>
            </div>
          </div>

          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-(--radius-panel) bg-gold px-4 py-3 text-body-lg font-bold text-background outline-none transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '확인'}
          </button>

          <p className="text-center text-sub-sm text-neutral-500">
            낙찰 즉시 결제 완료 · <em className="not-italic font-bold text-gold-light">영업일 기준 2~5일</em> 이내 발송
          </p>
        </div>
      </div>
    </>
  );

  if (layout === 'panel') {
    return <div className="relative flex w-full max-w-[560px] justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-(--modal-backdrop) px-4 backdrop-blur-(--modal-blur)">
      {content}
    </div>
  );
}
