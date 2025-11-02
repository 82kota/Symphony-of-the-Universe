import SoundTrack from "@/components/SoundTrack";
import { Play } from "lucide-react";

export type SoundTrackHandle = {
  play: () => void;
};

export default function ListenPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <SoundTrack />
      <SoundTrack />
      <div className=" transition-all duration-200 border-white hover:border-purple-400 text-white hover:text-purple-400">
        <button className=" p-4 rounded-full border  cursor-pointer ">
          <Play className=" hover:font-bold"></Play>
        </button>
      </div>
    </div>
  );
}
