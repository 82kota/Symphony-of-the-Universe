"use client";

import { useRef, useState } from "react";
import SoundTrack, { SoundTrackHandle } from "@/components/SoundTrack";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";

export default function ListenPage() {
  //stores refs for all tracks (for simultaneous control)
  const trackRefs = useRef<SoundTrackHandle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addRef = (el: SoundTrackHandle | null, index: number) => {
    if (el) trackRefs.current[index] = el;
  };

  const togglePlay = () => {
    if (isPlaying) {
      trackRefs.current.forEach((track) => track.pause());
      setIsPlaying(false);
    } else {
      trackRefs.current.forEach((track) => track.play());
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center pt-30 gap-5 bg-black">
      <SoundTrack
        src="/audio/moon-craters-drums.wav"
        className="grow"
        colour="blue"
        label="Moon meteorites"
        ref={(el) => addRef(el, 0)}
      />
      <SoundTrack
        src="/audio/moon-craters-piano.wav"
        className="grow"
        colour="orange"
        label="Solar radiation"
        ref={(el) => addRef(el, 1)}
      />
      <SoundTrack
        src="/audio/moon-craters-piano.wav"
        className="grow"
        colour="red"
        label="Solar flares"
        ref={(el) => addRef(el, 2)}
      />
      <div className="sticky bottom-0 w-full border-t py-2 bg-gray-950 ">
        <div className="flex items-center justify-center">
          <button
            className=" p-4 rounded-full border transition-all border-white hover:border-purple-400 text-white hover:text-purple-400 duration-200 cursor-pointer "
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="hover:font-bold" />
            ) : (
              <Play className="hover:font-bold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
