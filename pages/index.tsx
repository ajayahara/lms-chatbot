import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

const inter = Inter({ subsets: ["latin"] });

// Types
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const handleBoatClick = () => {
    setOpen(true);
    return;
  };
  return (
    <main
      className={`w-full h-screen overflow-scroll relative ${inter.className}`}
    >
      <div className="absolute bottom-4 right-2 z-50">
        <button onClick={handleBoatClick} className={!open ? "" : "hidden"}>
          <Image
            src="/chatboat.jpg"
            alt="chatboat"
            width={50}
            height={50}
            className="rounded-full"
          />
        </button>
        <div className={`w-80 h-96 rounded-xl shadow-md border border-gray-200 overflow-hidden ${!open ? "hidden" : ""}`}>
          <div className="bg-[#1a66e8] sticky z-50">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/nrupul.jpg"
                  alt="chatboat"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex flex-col text-white">
                  <p className="font-semibold">Chat with our leader</p>
                  <h3 className="font-bold">Nrupul Dev</h3>
                </div>
              </div>
              <div>
                <DotsVerticalIcon className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full p-2">

          </div>
          <div>

          </div>
        </div>
      </div>
    </main>
  );
}
// className='animate-pulse'
