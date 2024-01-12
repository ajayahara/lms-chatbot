import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import {
  CaretDownIcon,
  ChatBubbleIcon,
  DiscIcon,
  DotsVerticalIcon,
  GearIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { chatResponse } from "@/lib/openai";

const inter = Inter({ subsets: ["latin"] });

// Types
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there 👋, How can I help you today?",
    },
  ]);
  const handleBoatClick = () => {
    setOpen(true);
    return;
  };
  const handleCloseChat = () => {
    setOpen(false);
    return;
  };
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };
  const handleQuerySubmit = async () => {
    if (!query) return;
    setMessages([...messages, { role: "user", content: query }]);
    setQuery("");
    try {
      const res = await chatResponse(messages);
      setMessages([...messages, { role: "assistant", content: res }]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main
      className={`w-full h-screen overflow-scroll relative ${inter.className}`}
    >
      <div className="absolute bottom-2 right-2 z-50">
        {/* Chat Boat Button */}
        <button onClick={handleBoatClick} className={!open ? "" : "hidden"}>
          <Image
            src="/chatboat.jpg"
            alt="chatboat"
            width={50}
            height={50}
            priority
            className="rounded-full"
          />
        </button>
        {/* Chat Ui */}
        <div
          className={`w-80 h-96 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between overflow-hidden ${
            !open ? "hidden transition-all" : ""
          }`}
        >
          {/* Chat Header */}
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
              <button onClick={handleCloseChat}>
                <CaretDownIcon className="text-white w-6 h-6" />
              </button>
              <button>
                <DotsVerticalIcon className="text-white w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex flex-col w-full p-2 h-64 overflow-y-scroll text-sm example">
            {messages.map((message, index) => {
              return (
                <div
                  className={`max-w-64 text-white p-2 mb-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 self-end"
                      : "bg-gray-400 shadow self-start"
                  }`}
                  key={index}
                >
                  {message.content}
                </div>
              );
            })}
          </div>
          {/* Chat Input */}
          <div className="w-full flex gap-2 items-center p-2">
            <input
              type="text"
              placeholder="Enter your queries..."
              className="w-11/12 p-1 border-b border-gray-400 focus:outline-none"
              value={query}
              onChange={handleQueryChange}
            />
            <button
              onClick={handleQuerySubmit}
              className="w-1/12 h-full flex flex-col justify-center items-end"
            >
              <PaperPlaneIcon className="text-gray-500 w-5 h-5" />
            </button>
          </div>
          {/* Chat Footer */}
          <div className="flex justify-between items-center px-2 py-1">
            <div className="flex gap-2">
              <button
                onClick={handleQuerySubmit}
                className="flex justify-center items-center"
              >
                <DiscIcon className="text-gray-500 w-4 h-4" />
              </button>
              <button
                onClick={handleQuerySubmit}
                className="flex justify-center items-center"
              >
                <ChatBubbleIcon className="text-gray-500 w-4 h-4" />
              </button>
              <button
                onClick={handleQuerySubmit}
                className="flex justify-center items-center"
              >
                <GearIcon className="text-gray-500 w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-bold text-gradient">
              By masaischool.com
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// className='animate-pulse'
// bg-gradient-to-r from-blue-700 to-blue-500
// bg-gradient-to-l from-gray-500 to-gray-700
