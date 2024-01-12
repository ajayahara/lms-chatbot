import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import {
  CaretDownIcon,
  ChatBubbleIcon,
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
    setOpen(!open);
    return;
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleQuerySubmit = async () => {
    if (!query) return;
    setMessages((pre) => [...pre, { role: "user", content: query }]);
    setQuery("");
    try {
      const res = await chatResponse([
        ...messages,
        { role: "user", content: query },
      ]);
      setMessages((pre) => [...pre, { role: "assistant", content: res }]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    handleQuerySubmit();
  };
  return (
    <main
      className={`w-full h-screen overflow-scroll relative ${inter.className}`}
    >
      <div className="w-1/4 absolute bottom-2 right-2 z-50 flex flex-col items-end gap-3">
        {/* Chat Ui */}
        <div
          className={`w-full h-[80vh] rounded-lg shadow-2xl border border-gray-200 flex flex-col justify-between overflow-hidden ${
            !open ? "hidden transition-all" : ""
          }`}
        >
          {/* Chat Header */}
          <div className="bg-[#1a66e8] sticky z-50">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/chatboat.jpg"
                  alt="chatboat"
                  width={50}
                  height={50}
                  className="rounded-full bg-white"
                />
                <div className="flex flex-col text-white">
                  <p className="font-semibold">Chat with</p>
                  <h3 className="font-bold">Masai Team</h3>
                </div>
              </div>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex flex-col w-full p-2 h-3/4 overflow-y-scroll text-sm example">
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
              onKeyDown={handleEnterClick}
            />
            <button
              onClick={handleQuerySubmit}
              className="w-1/12 h-full flex flex-col justify-center items-end"
            >
              <PaperPlaneIcon className="text-gray-500 w-5 h-5" />
            </button>
          </div>
          {/* Chat Footer */}
          <div className="flex justify-between items-center px-2 pt-1 pb-3">
            <div className="flex gap-2">
              <button
                onClick={handleQuerySubmit}
                className="flex justify-center items-center"
              >
                <ChatBubbleIcon className="text-gray-500 w-5 h-5" />
              </button>
            </div>
            <div className="text-xs font-bold text-gradient">
              By masaischool.com
            </div>
          </div>
        </div>
        {/* Chat Boat Button */}
        {open ? (
          <button
            onClick={handleBoatClick}
            className="flex justify-center items-center p-1.5 bg-blue-600 rounded-full"
          >
            <CaretDownIcon className="text-white w-10 h-10" />
          </button>
        ) : (
          <button onClick={handleBoatClick}>
            <Image
              src="/chatboat.jpg"
              alt="chatboat"
              width={50}
              height={50}
              priority
              className="rounded-full"
            />
          </button>
        )}
      </div>
    </main>
  );
}
