import { http, HttpResponse } from "msw";

const envBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const handlers = [
  http.get(`${envBaseUrl}/api/health`, () => {
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${envBaseUrl}/api/v1/escrows`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "요청이 성공적으로 처리되었습니다.",
      data: [
        {
          escrowId: '1',
          imageUrl: 'https://picsum.photos/seed/camera/400/300',
          itemName: "빈티지 카메라",
          amount: 250000,
          escrowState: "DEPOSITED",
          createdAt: "2026-03-05 08:15:30"
        },
        {
          escrowId: '2',
          imageUrl: 'https://picsum.photos/seed/game/400/300',
          itemName: "레트로 게임기",
          amount: 180000,
          escrowState: "INVOICE_SUBMITTED",
          createdAt: "2026-03-05 09:20:15"
        },
        {
          escrowId: '3',
          imageUrl: 'https://picsum.photos/seed/shoes/400/300',
          itemName: "한정판 스니커즈",
          amount: 320000,
          escrowState: "COMPLETED",
          createdAt: "2026-03-05 10:45:50"
        },
        {
          escrowId: '4',
          imageUrl: 'https://picsum.photos/seed/card/400/300',
          itemName: "희귀 트레이딩 카드",
          amount: 150000,
          escrowState: "CANCELLED",
          createdAt: "2026-03-04 15:30:00"
        }
      ]
    });
  }),

  http.get(`${envBaseUrl}/api/v1/escrows/:escrowId`, ({ params }) => {
    const { escrowId } = params;
    return HttpResponse.json({
      status: "SUCCESS",
      message: "요청이 성공적으로 처리되었습니다.",
      data: {
        winningInfo: {
          imageUrl: escrowId === '1' ? 'https://picsum.photos/seed/camera/400/300' : escrowId === '2' ? 'https://picsum.photos/seed/game/400/300' : 'https://picsum.photos/seed/shoes/400/300',
          itemName: escrowId === '1' ? "빈티지 카메라" : escrowId === '2' ? "레트로 게임기" : "한정판 스니커즈",
          finalPrice: escrowId === '1' ? 250000 : escrowId === '2' ? 180000 : 320000,
          sellerName: "신재혁상점",
          sellerId: "asad_1",
          wonAt: "2026-03-01 10:24"
        },
        shippingAddress: {
          name: "이효은",
          phone: "010-3134-6396",
          postalCode: "03154",
          address: "서울시 종로구 세종대로 1",
          addressDetail: "재혁 빌라 405동 107호"
        },
        delivery: escrowId === '1' ? null : {
          courierName: escrowId === '2' ? "한진택배" : "CJ대한통운",
          trackingNumber: escrowId === '2' ? "123456789012" : "987654321098"
        }
      }
    });
  }),

  // Tracking Info POST (운송장 등록) - POST /api/v1/escrows/{escrowId}/invoice
  http.post(`${envBaseUrl}/v1/escrows/:escrowId/invoice`, async () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "운송장 배송 등록이 완료되었습니다.",
      data: null
    });
  }),

  // Escrow Cancel POST (거래 취소)
  http.post(`${envBaseUrl}/v1/escrows/:escrowId/cancel`, () => {
    return HttpResponse.json({
      status: "SUCCESS",
      message: "요청이 성공적으로 처리되었습니다.",
      data: null
    });
  }),
];
