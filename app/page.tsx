import Image from "next/image";
import earth_pic from "@/public/images/earth_big.jpeg";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen h-dvh items-center justify-center">
      <main className="items-center flex flex-col pb-14">
        <Image
          src={earth_pic}
          alt="Image of the Earth"
          className="w-full h-full fixed -z-10 inset-0 scale-180 object-cover pt-50"
        ></Image>
        <h1 className="text-7xl text-white font-bold mb-15">
          Symphony of the Universe
        </h1>
        <h2 className="text-3xl text-white font-medium">
          {" "}
          Universe's data transformed into sound{" "}
        </h2>
      </main>
    </div>
  );
}
