import { useEffect, useRef, useState } from "react";
import AudioVisualiser from "./AudioVisualiser";

interface SoundTrackProps {
  src: string;
}

export default function SoundTrack({ src }: SoundTrackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(
    null
  );

  // Initialize AudioContext once on the client
  useEffect(() => {
    const ctx = new AudioContext();
    setAudioCtx(ctx);
  }, []);

  // Create MediaElementSourceNode once audioRef and audioCtx are ready
  useEffect(() => {
    if (!audioRef.current || !audioCtx) return;

    const srcNode = audioCtx.createMediaElementSource(audioRef.current);
    setSource(srcNode);

    // Optionally resume context on user interaction
    audioCtx.resume();
  }, [audioRef.current, audioCtx]);

  return (
    <div className="w-full px-20">
      <div className="border border-white w-full h-52 rounded-3xl mb-4">
        {audioRef.current && source && audioCtx && (
          <AudioVisualiser audioCtx={audioCtx} analyserSource={source} />
        )}
      </div>
      <audio ref={audioRef} src={src} controls />
    </div>
  );
}
