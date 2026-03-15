import { useState } from 'react';
import Button from '@/components/common/Button';
import { BANKS } from '../../pages/SellerOnboarding/constants';
import type { AccountData } from '@/types';

type Step3Props = {
  onPrev: () => void;
  onNext: (data: AccountData) => void;
  hasExistingAccount: boolean;
};

const BANK_LIST = BANKS.filter((b) => Number(b.code) < 200);
const STOCK_LIST = BANKS.filter((b) => Number(b.code) >= 200);

export default function Step3({ onPrev, onNext }: Step3Props) {
  const [accountName, setaccountName] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankTab, setBankTab] = useState<'bank' | 'stock'>('bank');

  const selectedBankName = BANKS.find((b) => b.code === bank)?.name || '';

  const inputStyle = {
    height: '48px',
    backgroundColor: '#0B0C10',
    border: '1px solid #2C2C2E',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    padding: '0 16px',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
  } as React.CSSProperties;

  const handleNext = () => {
    if (!accountName) {
      setError('예금주명을 입력해주세요.');
      return;
    }
    if (!bank) {
      setError('은행을 선택해주세요.');
      return;
    }
    if (!accountNumber) {
      setError('계좌번호를 입력해주세요.');
      return;
    }
    setError('');
    onNext({ bankCode: bank, accountNum: accountNumber, accountName });
  };

  const handleSelectBank = (code: string) => {
    setBank(code);
    setError('');
    setShowBankModal(false);
  };

  const currentList = bankTab === 'bank' ? BANK_LIST : STOCK_LIST;

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
          정산받을 은행 계좌 인증을 진행해주세요.
        </h2>
        <p style={{ fontSize: '14px', color: '#C8C8C8' }}>판매 금액이 정산되는 계좌입니다.</p>
      </div>

      {/* 계좌 정보 입력 */}
      <p style={{ fontSize: '14px', color: '#E5E5EA', marginBottom: '12px', fontWeight: '600' }}>계좌 정보 입력</p>

      {/* 예금주명 */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={accountName}
          onChange={(e) => {
            setaccountName(e.target.value);
            setError('');
          }}
          placeholder="예금주명"
          style={inputStyle}
        />
      </div>

      {/* 은행 선택 버튼 */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setShowBankModal(true)}
          style={{
            ...inputStyle,
            textAlign: 'left',
            color: bank ? 'white' : '#636366',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{bank ? selectedBankName : '은행/증권사 선택'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* 은행 선택 모달 */}
      {showBankModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowBankModal(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[70vh] bg-[#1C1C1E] rounded-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[17px] font-bold text-white">은행/증권사 선택</h3>
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="bg-transparent border-none text-[#8E8E93] text-2xl cursor-pointer p-0"
                >
                  &times;
                </button>
              </div>
              <div className="flex border-b border-[#2C2C2E]">
                {(['bank', 'stock'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBankTab(tab)}
                    className={`flex-1 py-2.5 bg-transparent border-none text-sm font-semibold cursor-pointer ${
                      bankTab === tab
                        ? 'text-[#CEAF82] border-b-2 border-[#CEAF82]'
                        : 'text-[#8E8E93] border-b-2 border-transparent'
                    }`}
                  >
                    {tab === 'bank' ? '은행' : '증권사'}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto px-5 pt-2 pb-5">
              <div className="grid grid-cols-3 gap-2">
                {currentList.map((b) => (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => handleSelectBank(b.code)}
                    className={`py-3 px-1 border-none rounded-lg text-[13px] cursor-pointer text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                      bank === b.code
                        ? 'bg-[#CEAF82] text-[#0B0C10] font-bold'
                        : 'bg-[#2C2C2E] text-[#E5E5EA] font-normal'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account number */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          placeholder="계좌번호"
          style={inputStyle}
          maxLength={20}
        />
      </div>

      {error && <p style={{ color: '#FF453A', fontSize: '13px', paddingLeft: '4px', marginBottom: '8px' }}>{error}</p>}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <Button variant="outline" onClick={onPrev} className="w-30!">
          이전
        </Button>
        <Button onClick={handleNext} className="w-30!">
          다음
        </Button>
      </div>
    </>
  );
}
