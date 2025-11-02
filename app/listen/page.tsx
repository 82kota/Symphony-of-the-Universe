"use client";

import { useRef } from "react";
import SoundTrack from "@/components/SoundTrack";
import { Play } from "lucide-react";

export type SoundTrackHandle = {
  play: () => void;
};

export default function ListenPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <SoundTrack src="/audio/soft-piano-100-bpm-121529.mp3" />
      <div className=" transition-all duration-200 border-white hover:border-purple-400 text-white hover:text-purple-400">
        <button
          className=" p-4 rounded-full border  cursor-pointer "
          onClick={() => audioRef.current?.play()}
        >
          <Play className=" hover:font-bold"></Play>
        </button>
      </div>
    </div>
  );
}
