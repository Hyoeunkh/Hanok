import { useEffect } from 'react';

import useLiveKit from '@/hooks/useLiveKit';
import { usePostStreamToken } from '@/api/hooks/usePostStreamToken';

// LiveKit 서버 주소 (환경변수에서 가져오거나 기본값 사용)
const LIVEKIT_SERVER_URL = import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:7880';

interface StreamPlayerProps {
  streamId: number; // 접속할 방송 ID
  onStateChange?: (state: 'live' | 'disconnected' | 'ended') => void; // 상태 변경 시 부모에게 알림
}

export default function StreamPlayer({ streamId, onStateChange }: StreamPlayerProps) {
  // BE에 토큰 요청
  const { mutate: requestToken, data } = usePostStreamToken();

  // LiveKit 연결 훅
  const { state, videoEl, audioEl, connect } = useLiveKit({
    token: data?.token ?? null,
    serverUrl: LIVEKIT_SERVER_URL,
  });

  // 마운트 시 토큰 요청
  useEffect(() => {
    requestToken(streamId);
  }, [streamId, requestToken]);

  // 토큰 받으면 자동 연결
  useEffect(() => {
    if (data?.token) {
      connect();
    }
  }, [data?.token, connect]);

  // 상태 변경 시 부모 컴포넌트에 전달
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  return (
    <div className="relative h-full w-full bg-black">
      {/* 영상 출력 */}
      <video
        ref={videoEl}
        autoPlay
        playsInline
        className="h-full w-full object-contain"
      />
      {/* 음성 출력 (화면에 표시 안 됨) */}
      <audio ref={audioEl} autoPlay hidden />
    </div>
  );
}
