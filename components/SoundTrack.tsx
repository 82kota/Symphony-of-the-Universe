import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import AudioVisualiser from "./AudioVisualiser";
import { getAudioContext, getMediaSource } from "@/lib/audioSingleton";

interface SoundTrackProps {
  src: string;
  className?: string;
  label: string;
  colour?: "red" | "green" | "blue";
}

export type SoundTrackHandle = {
  play: () => void;
  pause: () => void;
};

const SoundTrack = forwardRef<SoundTrackHandle, SoundTrackProps>(
  ({ src, className, label, colour = "red" }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    const [source, setSource] = useState<MediaElementAudioSourceNode | null>(
      null
    );

    useImperativeHandle(ref, () => ({
      play: () => audioRef.current?.play(),
      pause: () => audioRef.current?.pause(),
    }));

    useEffect(() => {
      if (!audioRef.current) return;

      const ctx = getAudioContext();
      const srcNode = getMediaSource(audioRef.current);

      setAudioCtx(ctx);
      setSource(srcNode);

      ctx.resume();
    }, []);

    return (
      <div
        className={`flex w-full items-center justify-center gap-4 px-20 ${className}`}
      >
        <div>
          <p className="text-white text-2xl w-3xs">{label}</p>
        </div>
        <div className={`w-full `}>
          <div className="border border-white w-full h-52 rounded-3xl mb-4">
            {audioCtx && source && (
              <AudioVisualiser
                audioCtx={audioCtx}
                analyserSource={source}
                colour={colour}
              />
            )}
          </div>
          <audio ref={audioRef} src={src} />
        </div>
      </div>
    );
  }
);

export default SoundTrack;
