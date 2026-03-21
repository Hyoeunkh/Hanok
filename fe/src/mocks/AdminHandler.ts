import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/api/instance';

type MockWithdraw = {
  withdrawId: number;
  userId: number;
  nickname: string;
  amount: number;
  bankCode: string;
  accountNum: string;
  accountName: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  requestedAt: string;
  completedAt: string | null;
};

const mockWithdraws: MockWithdraw[] = [
  {
    withdrawId: 1,
    userId: 1,
    nickname: '구매자테스트',
    amount: 50000,
    bankCode: '088',
    accountNum: '110-123-456789',
    accountName: '홍길동',
    status: 'PENDING',
    requestedAt: '2026-03-20T10:30:00Z',
    completedAt: null,
  },
  {
    withdrawId: 2,
    userId: 2,
    nickname: '판매자테스트',
    amount: 150000,
    bankCode: '004',
    accountNum: '123-456-789012',
    accountName: '김철수',
    status: 'PENDING',
    requestedAt: '2026-03-19T14:20:00Z',
    completedAt: null,
  },
  {
    withdrawId: 3,
    userId: 3,
    nickname: '테스트유저',
    amount: 30000,
    bankCode: '011',
    accountNum: '987-654-321098',
    accountName: '이영희',
    status: 'COMPLETED',
    requestedAt: '2026-03-18T09:00:00Z',
    completedAt: '2026-03-18T15:30:00Z',
  },
  {
    withdrawId: 4,
    userId: 1,
    nickname: '구매자테스트',
    amount: 200000,
    bankCode: '088',
    accountNum: '110-123-456789',
    accountName: '홍길동',
    status: 'REJECTED',
    requestedAt: '2026-03-17T11:45:00Z',
    completedAt: null,
  },
  {
    withdrawId: 5,
    userId: 2,
    nickname: '판매자테스트',
    amount: 80000,
    bankCode: '004',
    accountNum: '123-456-789012',
    accountName: '김철수',
    status: 'PENDING',
    requestedAt: '2026-03-21T08:10:00Z',
    completedAt: null,
  },
];

export const adminHandlers = [
  http.get(`${BASE_URL}/v1/admin/withdraws`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const filtered = status
      ? mockWithdraws.filter((w) => w.status === status)
      : mockWithdraws;

    return HttpResponse.json({
      status: 'SUCCESS',
      message: '조회 성공',
      data: filtered,
    });
  }),

  http.post(`${BASE_URL}/v1/admin/withdraws/:withdrawId/complete`, ({ params }) => {
    const withdrawId = Number(params.withdrawId);
    const withdraw = mockWithdraws.find((w) => w.withdrawId === withdrawId);

    if (!withdraw) {
      return HttpResponse.json(
        { status: 'FAIL', message: '출금 요청 없음' },
        { status: 404 },
      );
    }

    withdraw.status = 'COMPLETED';
    withdraw.completedAt = new Date().toISOString();

    return HttpResponse.json({
      status: 'SUCCESS',
      message: '출금 완료 처리 성공',
      data: {},
    });
  }),
];
