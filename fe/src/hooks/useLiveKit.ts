// React 기본 훅
import { useCallback, useEffect, useRef, useState } from 'react';
// LiveKit SDK: Room(방), RoomEvent(방 이벤트 enum), Track(미디어 트랙 종류 enum)
// RemoteTrackPublication(원격 참가자의 트랙 정보), RemoteParticipant(원격 참가자)
import { Room, RoomEvent, Track, type RemoteTrackPublication, type RemoteParticipant } from 'livekit-client';

// 우리 프로젝트에서 정의한 스트림 상태 타입: 'live' | 'disconnected' | 'ended'
import type { StreamState } from '@/types';

// 훅에 전달할 옵션 (우리가 정의)
interface UseLiveKitOptions {
  token: string | null; // BE에서 발급받은 LiveKit 접속 토큰
  serverUrl: string; // LiveKit 서버 주소 (예: ws://localhost:7880)
}

// 훅이 반환하는 값 (우리가 정의)
interface UseLiveKitReturn {
  state: StreamState; // 현재 연결 상태
  videoEl: React.RefObject<HTMLVideoElement | null>; // <video> 태그에 연결할 ref
  audioEl: React.RefObject<HTMLAudioElement | null>; // <audio> 태그에 연결할 ref
  connect: () => Promise<void>; // 방 입장 함수
  disconnect: () => void; // 방 퇴장 함수
}

export default function useLiveKit({ token, serverUrl }: UseLiveKitOptions): UseLiveKitReturn {
  const [state, setState] = useState<StreamState>('disconnected'); // 연결 상태 관리
  const roomRef = useRef<Room | null>(null); // LiveKit Room 인스턴스 보관
  const videoEl = useRef<HTMLVideoElement | null>(null); // 영상 출력용 <video> ref
  const audioEl = useRef<HTMLAudioElement | null>(null); // 음성 출력용 <audio> ref

  // 원격 참가자(송출자)의 트랙을 video/audio 엘리먼트에 연결하는 함수
  const attachTrack = useCallback((publication: RemoteTrackPublication) => {
    const track = publication.track; // [LiveKit] 실제 미디어 트랙 객체
    if (!track) return;

    // [LiveKit] Track.Kind.Video / Track.Kind.Audio 로 트랙 종류 구분
    if (track.kind === Track.Kind.Video && videoEl.current) {
      track.attach(videoEl.current); // [LiveKit] 트랙을 DOM 엘리먼트에 연결
    } else if (track.kind === Track.Kind.Audio && audioEl.current) {
      track.attach(audioEl.current);
    }
  }, []);

  // LiveKit 서버에 연결하는 함수
  const connect = useCallback(async () => {
    if (!token) return;

    const room = new Room(); // [LiveKit] 새 Room 인스턴스 생성
    roomRef.current = room;

    // [LiveKit] 새로운 트랙이 구독되면 → video/audio에 attach
    room.on(RoomEvent.TrackSubscribed, (_track, publication) => {
      attachTrack(publication);
    });

    // [LiveKit] 트랙 구독 해제되면 → DOM에서 분리
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach();
    });

    // [LiveKit] 연결 성공
    room.on(RoomEvent.Connected, () => {
      setState('live');
    });

    // [LiveKit] 연결 끊김
    room.on(RoomEvent.Disconnected, () => {
      setState('disconnected');
    });

    // [LiveKit] 재연결 시도 중
    room.on(RoomEvent.Reconnecting, () => {
      setState('disconnected');
    });

    // [LiveKit] 재연결 성공
    room.on(RoomEvent.Reconnected, () => {
      setState('live');
    });

    // [LiveKit] 실제 서버 연결 (serverUrl: 서버주소, token: 인증토큰)
    await room.connect(serverUrl, token);

    // 연결 시점에 이미 송출 중인 트랙이 있으면 바로 attach
    room.remoteParticipants.forEach((participant: RemoteParticipant) => {
      participant.trackPublications.forEach((publication: RemoteTrackPublication) => {
        if (publication.isSubscribed) {
          attachTrack(publication);
        }
      });
    });
  }, [token, serverUrl, attachTrack]);

  // 방에서 나가는 함수
  const disconnect = useCallback(() => {
    roomRef.current?.disconnect(); // [LiveKit] Room 연결 해제
    roomRef.current = null;
    setState('disconnected');
  }, []);

  // 컴포넌트 언마운트 시 자동으로 연결 정리
  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  return { state, videoEl, audioEl, connect, disconnect };
}
