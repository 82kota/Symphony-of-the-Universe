import Image from "next/image";
import sarah_img from "@/public/images/sarah.jpg";

export default function AboutPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black mt-10 gap-5">
      <p className="text-4xl text-white">About</p>
      <Image
        src={sarah_img}
        alt="Sarah image"
        className="w-xl rounded-3xl"
      ></Image>
    </div>
  );
}
