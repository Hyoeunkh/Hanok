import { useMutation } from '@tanstack/react-query';

import { getFetchInstance } from '../instance';

// BE 응답 타입: LiveKit 접속 토큰
interface StreamTokenResponse {
  token: string; // LiveKit 서버 연결에 사용할 JWT 토큰
}

// API 경로: streamId별 토큰 발급
export const getStreamTokenPath = (streamId: number) => `/v1/streams/${streamId}/token`;

// BE에 토큰 발급 요청
export const fetchStreamToken = async (streamId: number) => {
  const response = await getFetchInstance().post<StreamTokenResponse>(getStreamTokenPath(streamId));
  return response.data;
};

// 토큰 발급 훅 (컴포넌트에서 사용)
export const usePostStreamToken = () => {
  return useMutation({
    mutationFn: (streamId: number) => fetchStreamToken(streamId),
  });
};
