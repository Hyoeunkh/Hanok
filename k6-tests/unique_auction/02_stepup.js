import ws from 'k6/ws';
import http from 'k6/http';
import { sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import exec from 'k6/execution';
import { generateUniqueAuctionSummary } from '../shared/summary.js';

const HTTP_BASE  = (__ENV.BASE_URL    || 'http://j14d105.p.ssafy.io:8080/api/v1').replace(/\/+$/, '');
const WS_BASE    = (__ENV.WS_BASE_URL || 'ws://j14d105.p.ssafy.io:8080/ws-connect').replace(/\/+$/, '');
const STREAM_ID  = 61;
const AUCTION_ID = 70;
const BID_MIN    = 10000;
const BID_MAX    = 100000;

const wsErrors           = new Rate('ws_errors');
const bidSuccessRate     = new Rate('bid_success_rate');
const bidSentCount       = new Counter('bid_sent_count');
const bidAckCount        = new Counter('bid_ack_count');
const statsReceivedCount = new Counter('stats_received_count');
const stompErrorCount    = new Counter('stomp_error_count');
const alreadyBidCount    = new Counter('already_bid_count');
const breakingPointVUs   = new Trend('breaking_point_vus');

export const options = {
  setupTimeout: '300s',
  tags: { domain: 'unique_auction', scenario: 'stepup' },
  scenarios: {
    step_up: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 50   },
        { duration: '1m',  target: 200  },
        { duration: '1m',  target: 500  },
        { duration: '1m',  target: 1000 },
      ],
    },
  },
  thresholds: {
    ws_errors:        ['rate<0.05'],
    bid_success_rate: ['rate>0.95'],
  },
};

export function setup() {
  console.log('🚀 1000명 유저 로그인 시작...');
  const tokens = [];

  for (let i = 1; i <= 1000; i++) {
    const res = http.post(
      `${HTTP_BASE}/auth/login`,
      JSON.stringify({ email: `uniquetest${i}@k6.com`, password: 'password123!' }),
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 200) {
      const token = JSON.parse(res.body).data?.accessToken;
      if (token) tokens.push(`Bearer ${token}`);
    } else {
      console.error(`[Setup] 로그인 실패: uniquetest${i}@k6.com → HTTP ${res.status}`);
    }

    if (i % 100 === 0) {
      console.log(`진행중: ${i}/1000, 성공: ${tokens.length}`);
    }
  }

  if (tokens.length === 0) {
    throw new Error('❌ 로그인된 유저가 없습니다!');
  }

  console.log(`✅ 로그인 완료: ${tokens.length}/1000`);
  return { tokens };
}

export default function (data) {
  if (!data.tokens || data.tokens.length === 0) return;

  const userIndex = (__VU - 1) % data.tokens.length;
  const token     = data.tokens[userIndex];
  const bidAmount = BID_MIN + (userIndex % (BID_MAX - BID_MIN));

  ws.connect(WS_BASE, { headers: { Authorization: token } }, function (socket) {
    let bidAcked      = false;
    let statsReceived = false;

    socket.on('open', () => {
      socket.send(
        `CONNECT\naccept-version:1.1,1.0\nhost:j14d105.p.ssafy.io\n` +
        `heart-beat:10000,10000\nAuthorization:${token}\n\n\0`
      );
    });

    socket.on('message', (raw) => {

      if (raw.startsWith('CONNECTED')) {
        // ✅ 에러 수신 채널 추가
        socket.send(`SUBSCRIBE\nid:sub-private\ndestination:/user/private/streams/${STREAM_ID}\n\n\0`);
        socket.send(`SUBSCRIBE\nid:sub-broadcast\ndestination:/broadcast/streams/${STREAM_ID}\n\n\0`);
        socket.send(`SUBSCRIBE\nid:sub-errors\ndestination:/user/private/errors\n\n\0`);

        socket.setTimeout(() => {
          const bidPayload = {
            eventType: 'UNIQUE_BID_PLACE',
            payload: { auctionId: AUCTION_ID, amount: bidAmount }
          };
          socket.send(
            `SEND\ndestination:/app/streams/${STREAM_ID}\n` +
            `content-type:application/json\n\n${JSON.stringify(bidPayload)}\0`
          );
          bidSentCount.add(1);
        }, 500);
      }

      if (raw.startsWith('MESSAGE')) {
        const body   = raw.substring(raw.indexOf('\n\n') + 2).replace(/\0$/, '');
        const parsed = JSON.parse(body);

        // ✅ 정상 ACK
        if (parsed.eventType === 'UNIQUE_BID_ACK') {
          bidAckCount.add(1);
          bidAcked = true;
        }

        // ✅ 정상 STATS
        if (parsed.eventType === 'UNIQUE_AUCTION_STATS') {
          statsReceivedCount.add(1);
          statsReceived = true;
        }

        // ✅ 서버 에러 — /user/private/errors 로 오는 MESSAGE
        if (parsed.eventType === 'ERROR') {
          const code   = parsed.payload?.code;
          const errMsg = parsed.payload?.message;


          if (code === 'UNIQUE-003') {
            alreadyBidCount.add(1);
          } else {
            console.error(`🚨 STOMP ERROR - code: ${code}, msg: ${errMsg}, VU: ${__VU}`);
            stompErrorCount.add(1);
            wsErrors.add(true);
            bidSuccessRate.add(false);
            breakingPointVUs.add(exec.instance.vusActive);
          }
          socket.close();
          return;
        }

        if (bidAcked && statsReceived) {
          bidSuccessRate.add(true);
          socket.close();
        }
      }

      // STOMP 프로토콜 레벨 ERROR 프레임 (연결 자체 문제)
      if (raw.startsWith('ERROR')) {
        stompErrorCount.add(1);
        wsErrors.add(true);
        bidSuccessRate.add(false);
        breakingPointVUs.add(exec.instance.vusActive);
        socket.close();
      }
    });

    socket.setTimeout(() => socket.close(), 5000);
  });

  sleep(1);
}

export function handleSummary(data) {
  return generateUniqueAuctionSummary(data, 'unique_auction_02_stepup');
}