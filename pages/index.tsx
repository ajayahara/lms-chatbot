// import Image from "next/image";
// import { Inter } from "next/font/google";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {
//   CaretDownIcon,
//   CounterClockwiseClockIcon,
//   PlusIcon,
// } from "@radix-ui/react-icons";
// import { chatResponse } from "@/lib/openai";
// import { DotPulseLoading } from "@/components/bot/loader/DotPulseLoading";
// import { Interaction, Message } from "@/types";
// import { interactions, chats } from "@/db";

import AIBot from "@/components/ChatBoatIntegration/ChatBoat";

// const inter = Inter({ subsets: ["latin"] });

// export default function Home() {
//   // State
//   const [open, setOpen] = useState<boolean>(false);
//   const [isChat, setIsChat] = useState<boolean>(true);
//   const [query, setQuery] = useState<string>("");
//   const [history, setHistory] = useState<Interaction[]>([]);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "assistant",
//       content: "Hi there 👋, How can I help you today?",
//     },
//   ]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const searchParams = useSearchParams();
//   const interaction_id = searchParams.get("interaction_id");

//   const handleBoatClick = () => {
//     setOpen(!open);
//   };
//   const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (error) {
//       setError("");
//     }
//     setQuery(e.target.value);
//   };
//   const handleEnterClick = async (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key !== "Enter") return;
//     if (!query) return;
//     setIsChat(true);
//     setLoading(true);
//     try {
//       const userMessage: Message = { role: "user", content: query };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setQuery("");
//       const send_message_audio = new Audio("/send_message_tone.mp3");
//       await send_message_audio.play();
//       const assistantResponse = await chatResponse([...messages, userMessage]);
//       const assistantMessage: Message = {
//         role: "assistant",
//         content: assistantResponse,
//       };
//       setMessages((prevMessages) => [...prevMessages, assistantMessage]);
//     } catch (err) {
//       console.log(err);
//       const error_message_audio = new Audio("/error_message_tone.mp3");
//       error_message_audio.volume = 0.2;
//       await error_message_audio.play();
//       setError("Error while connecting to server");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setIsChat(true);
//     setError("");
//     console.log("interactionId", interaction_id);
//     // fetch messages related to the inraction id here;
//     if (!interaction_id) {
//       setMessages([
//         {
//           role: "assistant",
//           content: "Hi there 👋, How can I help you today?",
//         },
//       ]);
//       return;
//     }
//     setMessages(chats.filter((el) => el.interaction_id == interaction_id));
//   }, [interaction_id]);
//   useEffect(() => {
//     // fetch chat history here related to the user here;
//     setHistory(interactions);
//   }, []);

//   return (
//     <main
//       className={`w-full h-screen overflow-scroll relative ${inter.className}`}
//     >
//       <div className="w-1/4 absolute bottom-2 right-2 z-50 flex flex-col items-end gap-3">
//         {/* Chat Ui */}
//         <div
//           className={`w-full h-[80vh] rounded-lg shadow-2xl border border-gray-200 flex flex-col justify-between overflow-hidden ${
//             !open ? "hidden transition-all" : ""
//           }`}
//         >
//           {/* Chat Header */}
//           <div className="bg-[#211670] sticky z-50">
//             <div className="flex items-center justify-between p-2">
//               <div className="flex items-center gap-2">
//                 <Image
//                   src="/chatboat.jpg"
//                   alt="chatboat"
//                   width={50}
//                   height={50}
//                   className="rounded-full bg-white"
//                 />
//                 <div className="flex flex-col text-white">
//                   <p className="font-semibold">Chat with</p>
//                   <h3 className="font-bold">Masai Team</h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Chat Messages */}
//           <div className="flex flex-col w-full p-2 h-3/4 overflow-y-scroll text-sm example">
//             {isChat ? (
//               <div className="w-full flex flex-col">
//                 {error ? (
//                   <div className="pb-2 text-center text-red-500">{error}</div>
//                 ) : null}
//                 {messages.map((message: Message, index: number) => (
//                   <div
//                     className={`max-w-3/4 text-white p-2 mb-2 rounded-lg ${
//                       message.role === "user"
//                         ? "bg-[#211670] self-end"
//                         : "bg-[#a6a2e5] shadow self-start"
//                     }`}
//                     key={index}
//                   >
//                     {message.content}
//                   </div>
//                 ))}
//                 {loading ? <DotPulseLoading /> : null}
//               </div>
//             ) : (
//               <div className="flex flex-col">
//                 <div>
//                   <button
//                     onClick={() => setIsChat(true)}
//                     className="text-blue-600 text-xs"
//                   >
//                     &larr; Back
//                   </button>
//                 </div>
//                 <div className="text-left text-lg font-bold text-gray-500 mb-2">
//                   Chat History:
//                 </div>
//                 <div className="min-h-64 flex flex-col rounded shadow">
//                   {history.map((interaction: Interaction, index: number) => (
//                     <Link
//                       className="p-2 font-bold text-md text-gray-400"
//                       href={`/?interaction_id=${interaction.id}`}
//                       key={index}
//                     >
//                       &rarr; {interaction.title}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* Chat Input */}
//           <div className="w-full p-2">
//             <input
//               type="text"
//               placeholder="Enter your queries..."
//               className="w-full p-1 border-b border-gray-400 focus:outline-none"
//               value={query}
//               onChange={handleQueryChange}
//               onKeyDown={handleEnterClick}
//             />
//           </div>
//           {/* Chat Footer */}
//           <div className="flex flex-row-reverse justify-between items-center px-2 pt-1 pb-3">
//             <div className="flex gap-2">
//               <button
//                 title="Show history"
//                 onClick={() => setIsChat(false)}
//                 className="flex justify-center items-center"
//               >
//                 <CounterClockwiseClockIcon className="text-gray-500 w-5 h-5" />
//               </button>
//               <Link
//                 title="New chat"
//                 className="flex justify-center items-center"
//                 href="/"
//               >
//                 <PlusIcon className="text-gray-500 w-5 h-5" />
//               </Link>
//             </div>
//             <div className="text-xs font-bold text-[#211670]">
//               By masaischool.com
//             </div>
//           </div>
//         </div>
//         {/* Chat Boat Button */}
//         {open ? (
//           <button
//             onClick={handleBoatClick}
//             className="flex justify-center items-center p-1.5 bg-[#211670] rounded-full"
//           >
//             <CaretDownIcon className="text-white w-10 h-10" />
//           </button>
//         ) : (
//           <button onClick={handleBoatClick}>
//             <Image
//               src="/chatboat.jpg"
//               alt="chatboat"
//               width={50}
//               height={50}
//               priority
//               className="rounded-full"
//             />
//           </button>
//         )}
//       </div>
//     </main>
//   );
// }

// const index = () => {
//   return (
//     <main className="relative h-screen w-full">
//       <AIBot/>
//     </main>
//   )
// }

// export default index
// import { useRecognization } from "@/hook/useRecognization";
// import { useEffect, useState } from "react";
// import { HiMicrophone } from "react-icons/hi2";
// import { useTextToSpeech } from "@/hook/useTextToSpeech";

// export default function Home() {
//   const { text, isListining, startListining, stopListining } =
//     useRecognization();
//   const [client, setClient] = useState<boolean>(false);
//   const hasSupportRecognization = true;
//   useEffect(() => {
//     setClient(true);
//   }, []);

//   return (
//     <main
//       className="w-full h-screen flex justify-center items-center"
//       suppressHydrationWarning
//     >
//       {!hasSupportRecognization ? (
//         <div>Browser did not support SpeechRecognition</div>
//       ) : (
//         <div className="bg-[#211670] w-1/4 flex flex-col p-2 gap-3">
//           <div className="text-blue-800 text-center bg-white overflow-y-scroll h-32 example">
//             {text}
//           </div>
//           <button
//             className="w-10 h-10 m-auto rounded-full flex justify-center items-center bg-white"
//             onClick={isListining ? stopListining : startListining}
//           >
//             <HiMicrophone
//               className={`text-blue-800 ${isListining ? "animate-pulse" : ""}`}
//             />
//           </button>
//         </div>
//       )}
//     </main>
//   );
// }


// // text to Speech
// export  function TextToSpeechComponent() {
//   const { speak, hasSupportTextToSpeech } = useTextToSpeech();
//   const [textToSpeak, setTextToSpeak] = useState<string>("Hello, this is a test.");

//   const handleSpeak = () => {
//     speak(textToSpeak);
//   };

//   return (
//     <div>
//       {hasSupportTextToSpeech ? (
//         <>
//           <textarea
//             value={textToSpeak}
//             onChange={(e) => setTextToSpeak(e.target.value)}
//             rows={4}
//             cols={50}
//           />
//           <button onClick={handleSpeak}>Speak</button>
//         </>
//       ) : (
//         <div>Text-to-speech is not supported in this browser.</div>
//       )}
//     </div>
//   );
// }


// new code 

import React, { useState } from "react";
import { useVoiceRecognition, useTextToSpeech } from "@/hook/speech";

export default function VoiceSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const { startListening, stopListening } = useVoiceRecognition(handleRecognitionResult);
  const { speak } = useTextToSpeech();

  function handleRecognitionResult(result: string) {  // Specify the type for the 'result' parameter
    setSearchQuery(result);
    speak( result);
  }

  return (
    <div>
      <h1>Voice Search</h1>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
    </div>
  );
}