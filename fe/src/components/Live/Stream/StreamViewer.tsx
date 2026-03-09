import { useState } from "react";
import StreamDisconnected from "./Streamdisconnected";

type StreamState = "live" | "disconnected" | "waiting";

//openVidu subscriber 붙이기 전 껍데기
// useOpenVidu 훅 완성 후 videoRef 연결예정
export default function StreamViewer() {
  const [state, setState] = useState<StreamState>("disconnected");

  // OpenVidu 이벤트 연결 위치
  // session.on('streamDestroyed', () => setState('disconnected'))
  // session.on('reconnected',     () => setState('live'))

  return (
    <>
      {state === "disconnected" && (
        <StreamDisconnected onTimeout={() => setState("waiting")} />
      )}
      {/* 실제 영상 엘리먼트 */}
    </>
  );
}
