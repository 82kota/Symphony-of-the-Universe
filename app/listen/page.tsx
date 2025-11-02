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
    <div className="h-full flex flex-col items-center justify-center pt-30 gap-5 bg-black">
      {/*Todo: refactor*/}
      <div className="flex w-full items-center justify-center gap-4 px-20">
        <p className="text-white text-2xl">Moon meteorites</p>
        <SoundTrack
          src="/audio/soft-piano-100-bpm-121529.mp3"
          className="grow"
          colour="red"
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4 px-20">
        <p className="text-white text-2xl">Solar radiation</p>
        <SoundTrack
          src="/audio/soft-piano-100-bpm-121529.mp3"
          className="grow"
          colour="green"
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4 px-20">
        <p className="text-white text-2xl">Moon meteorites</p>
        <SoundTrack
          src="/audio/hotline-bling-drake-low-quality-made-with-Voicemod.mp3"
          className="grow"
          colour="blue"
        />
      </div>
      <div className="sticky bottom-0 w-full border-t py-2 bg-gray-950 ">
        <div className="flex items-center justify-center">
          <button
            className=" p-4 rounded-full border transition-all border-white hover:border-purple-400 text-white hover:text-purple-400 duration-200 cursor-pointer "
            onClick={() => audioRef.current?.play()}
          >
            <Play className=" hover:font-bold"></Play>
          </button>
        </div>
      </div>
    </div>
  );
}
