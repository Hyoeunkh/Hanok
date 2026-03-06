import { http, HttpResponse } from 'msw';

import { mainHandlers } from './MainHandler';

export const handlers = [
  ...mainHandlers,
  http.get('/api/health', () => {
    return HttpResponse.json({ ok: true });
  }),
];
