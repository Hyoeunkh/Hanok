export type WithdrawStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export type WithdrawItem = {
  withdrawId: number;
  userId: number;
  nickname: string;
  amount: number;
  bankCode: string;
  accountNum: string;
  accountName: string;
  status: WithdrawStatus;
  requestedAt: string;
  completedAt: string | null;
};

export type GetWithdrawsResponse = WithdrawItem[];
