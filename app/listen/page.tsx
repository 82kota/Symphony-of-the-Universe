import SoundTrack from "@/components/sound_track";
import { Play } from "lucide-react";

export default function ListenPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <SoundTrack />
      <button className=" p-4 rounded-full border border-white cursor-pointer transition-all duration-200">
        <Play className="text-white"></Play>
      </button>
    </div>
  );
}
