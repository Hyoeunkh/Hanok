import { useEffect } from 'react';

import NftReceiptDetailContent from '@/components/common/NftReceiptDetailContent';

type NftReceiptModalProps = {
  escrowId: string | number;
  onClose: () => void;
};

export default function NftReceiptModal({ escrowId, onClose }: NftReceiptModalProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="NFT 영수증"
        className="max-h-[90vh] w-full max-w-[700px] overflow-y-auto custom-scrollbar rounded-[28px] border border-white/8 bg-background shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <NftReceiptDetailContent escrowId={escrowId} onClose={onClose} closeVariant="modal" />
        </div>
      </div>
    </div>
  );
}
