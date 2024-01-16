import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  CaretDownIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import { chatResponse } from "@/lib/openai";
import { DotPulseLoading } from "@/components/bot/loader/DotPulseLoading";

const inter = Inter({ subsets: ["latin"] });

// Types
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default function Home() {
  // State
  const [open, setOpen] = useState<boolean>(false);
  const [ChatBubble, setChatBubble] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there 👋, How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [interactionId, setInteractionId] = useState(null);

  const handleBoatClick = () => {
    setOpen(!open);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError("");
    }
    setQuery(e.target.value);
  };
  const handleEnterClick = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!query) return;
    setLoading(true);
    const userMessage: Message = { role: "user", content: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setHistoryMessages((prevHistory) => [...prevHistory, userMessage]);
    setQuery("");
    try {
      const assistantResponse = await chatResponse([...messages, userMessage]);
      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setHistoryMessages((prevHistory) => [
        ...prevHistory,
        { ...assistantMessage },
      ]);
    } catch (err) {
      console.log(err);
      setError("Error while connecting to server");
    }
    setLoading(false);
  };
  
  const handleHistoryButtonClick = () => {
    setChatBubble(!ChatBubble);
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
            {ChatBubble ? (
              <>
                {historyMessages.map((message, index) => (
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
                ))}
              </>
            ) : (
              <div className="w-full flex flex-col">
                {error ? (
                  <div className="pb-2 text-center text-red-500">{error}</div>
                ) : null}
                {messages.map((message: Message, index: number) => (
                  <div
                    className={`max-w-3/4 text-white p-2 mb-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 self-end"
                        : "bg-gray-400 shadow self-start"
                    }`}
                    key={index}
                  >
                    {message.content}
                  </div>
                ))}
                {loading ? <DotPulseLoading /> : null}
              </div>
            )}
          </div>
          {/* Chat Input */}
          <div className="w-full p-2">
            <input
              type="text"
              placeholder="Enter your queries..."
              className="w-full p-1 border-b border-gray-400 focus:outline-none"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleEnterClick}
            />
          </div>
          {/* Chat Footer */}
          <div className="flex flex-row-reverse justify-between items-center px-2 pt-1 pb-3">
            <div className="flex gap-2">
              <button
                onClick={handleHistoryButtonClick}
                className="flex justify-center items-center"
              >
                <CounterClockwiseClockIcon className="text-gray-500 w-5 h-5" />
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
