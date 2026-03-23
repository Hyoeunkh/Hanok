import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function generateSummary(data, testName) {
  const metrics = data.metrics;

  const p95 = metrics['http_req_duration']?.values?.['p(95)']?.toFixed(2) ?? 'N/A';
  const p99 = metrics['http_req_duration']?.values?.['p(99)']?.toFixed(2) ?? 'N/A';
  const avgLatency = metrics['http_req_duration']?.values?.avg?.toFixed(2) ?? 'N/A';
  const errorRate = ((metrics['http_req_failed']?.values?.rate ?? 0) * 100).toFixed(2);
  const tps = metrics['http_reqs']?.values?.rate?.toFixed(2) ?? 'N/A';
  const vus = metrics['vus_max']?.values?.max ?? 'N/A';

  const wsErrorRate = ((metrics['ws_errors']?.values?.rate ?? 0) * 100).toFixed(2);
  const wsSessions = metrics['ws_sessions']?.values?.count ?? 'N/A';

  const csvLine = `${testName},${vus},${p95},${p99},${avgLatency},${tps},${errorRate},${wsErrorRate}\n`;

  const summary = `
========================================
  테스트: ${testName}
  최대 VUser: ${vus}
  HTTP p95 Latency: ${p95} ms
  HTTP 평균 Latency: ${avgLatency} ms
  HTTP TPS: ${tps} req/s
  HTTP 에러율: ${errorRate}%
  WS 세션 수: ${wsSessions}
  WS 에러율: ${wsErrorRate === 'NaN' ? 0 : wsErrorRate}%
========================================
`;

  delete data.setup_data;

  // ✅ PowerShell에서 넘겨준 타임스탬프 가져오기 (없으면 현재 시간 대체)
  const ts = __ENV.TEST_TIMESTAMP || new Date().toISOString().replace(/[:.]/g, '-');

  // ✅ 파일명 앞에 타임스탬프를 일괄 적용
  const filePrefix = `reports/${ts}_${testName}`;

  return {
    stdout: summary + '\n' + textSummary(data, { indent: '  ', enableColors: true }),
    [`${filePrefix}_result.json`]: JSON.stringify(data, null, 2),
    [`${filePrefix}_summary.csv`]: 'test_name,vus_max,p95_ms,p99_ms,avg_ms,tps,error_rate,ws_error_rate\n' + csvLine,
  };
}