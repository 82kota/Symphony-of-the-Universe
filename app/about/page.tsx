import Image from "next/image";
import sarah_img from "@/public/images/sarah.jpg";

export default function AboutPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black mt-20 gap-5">
      <p className="text-4xl text-white">About</p>
      <p className=" text-3xl text-white">
        Developed by team Churnham (Chester + Durham) for the Durhack 2025
      </p>
      <p className="text-2xl text-white">
        Oscar Jermutus, Sarah Mitchell, Saifaldeen Alhmoud, Vasilii Zubarev
      </p>
      <Image
        src={sarah_img}
        alt="Sarah image"
        className="w-xl rounded-3xl"
      ></Image>
    </div>
  );
}
