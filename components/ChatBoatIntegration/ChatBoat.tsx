import { useState, useRef, useEffect } from "react";
import { RxCaretDown } from "react-icons/rx";
import { GoHistory } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
// import MasaiBot from "src/assets/Masai-bot.svg";
import axios from "axios";
import { PiRecordFill } from "react-icons/pi";
import { FaCirclePause } from "react-icons/fa6";
import { useContext } from "react";
// import { AuthContext } from "src/context/AuthContext";
import { Interaction, Message } from "./Type/type";
import { interactions, chats } from "./Db/db";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DotPulseLoading } from "./Loader/DotPulseLoading";

export default function AIBot() {
  const [open, setOpen] = useState<boolean>(false);
  const [isChat, setIsChat] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [history, setHistory] = useState<Interaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there 👋, How can I help you today?",
    },
  ]);
  const [isRecording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const { currentUser } = useContext(AuthContext);

  const currentUser:any={id:1}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const interaction_id = searchParams.get("interaction_id");
  const playAudio = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
          sendAudioData(audioBlob);
          chunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudioData = async (audioBlob: Blob): Promise<void> => {
    const buffer = await audioBlob.arrayBuffer();
    const formData = new FormData();
    formData.append(
      "audio",
      new Blob([buffer], { type: "audio/wav" }),
      "audio.wav"
    );

    const response = await fetch(
      `${process.env.REACT_APP_GQL_BASE_URL}/support?user_id=${currentUser.id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      // Assuming the backend sends the audio URL in the response
      const responseData = await response.blob();
      console.log("RESPONSE");
      playAudio(responseData);
    } else {
      console.error("Error:", response.statusText);
    }
  };

  const handleBoatClick = () => {
    setOpen(!open);
    return;
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleEnterClick = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!query) return;
    setIsChat(true);
    setLoading(true);
    try {
      const userMessage: Message = { role: "user", content: query };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setQuery("");
      // You may chage code here
      // The response for first query should contain an interaction_id.Afte this you should navigate to /?interaction_id=response.interaction_id. You can get more idea after looking types of message and interaction.
      const assistantResponse = await axios.post(
        `http://localhost:5000/support`,
        {
          role: "user",
          content: query,
        }
      );
      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse.data.content,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err) {
      console.log(err);
      setError("Error while connecting to server");
    }
    setLoading(false);
  };

  useEffect(() => {
    setIsChat(true);
    setError("");
    console.log("interactionId", interaction_id);
    // fetch messages related to the inraction id here;
    if (!interaction_id) {
      setMessages([
        {
          role: "assistant",
          content: "Hi there 👋, How can I help you today?",
        },
      ]);
      return;
    }
    setMessages(chats.filter((el) => el.interaction_id == interaction_id));
  }, [interaction_id]);
  useEffect(() => {
    // fetch chat history here related to the user here;
    setHistory(interactions);
  }, []);

  return (
    <main
      className={`fixed bottom-0 left-0 right-0 flex justify-center items-end z-50 `}
    >
      <div className="w-1/4 absolute bottom-2 right-2 z-50 flex flex-col items-end gap-3">
        {/* Chat Ui */}
        <div
          className={`w-full h-[60vh] rounded-lg shadow-2xl border border-gray-200 flex flex-col justify-between bg-white overflow-hidden ${
            !open ? "hidden transition-all" : ""
          }`}
        >
          {/* Chat Header */}
          <div className="bg-[#1a66e8] sticky z-50">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-white">
                  <p className="font-semibold">Chat with</p>
                  <h3 className="font-bold">Masai Team</h3>
                </div>
              </div>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex flex-col w-full p-2 h-3/4 overflow-y-scroll text-sm example">
            {isChat ? (
              <div className="w-full flex flex-col">
                {error ? (
                  <div className="pb-2 text-center text-red-500">{error}</div>
                ) : null}
                {messages.map((message: Message, index: number) => (
                  <div
                    className={`max-w-3/4 text-white p-2 mb-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-[#211670] self-end"
                        : "bg-[#a6a2e5] shadow self-start"
                    }`}
                    key={index}
                  >
                    {message.content}
                  </div>
                ))}
                {loading ? <DotPulseLoading /> : null}
              </div>
            ) : (
              <div className="flex flex-col">
                <div>
                  <button
                    onClick={() => setIsChat(true)}
                    className="text-blue-600 text-xs"
                  >
                    &larr; Back
                  </button>
                </div>
                <div className="text-left text-lg font-bold text-gray-500 mb-2">
                  Chat History:
                </div>
                <div className="min-h-64 flex flex-col rounded shadow">
                  {history.map((interaction: Interaction, index: number) => (
                    <Link
                      className="p-2 font-bold text-md text-gray-400"
                      href={`/?interaction_id=${interaction.id}`}
                      key={index}
                    >
                      &rarr; {interaction.title}
                    </Link>
                  ))}
                </div>
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
          <div className="flex justify-between items-center px-2 pt-1 pb-3">
            <div className="flex gap-2">
              <button
                title="Show history"
                onClick={() => setIsChat(false)}
                className="flex justify-center items-center"
              >
                <GoHistory className="text-gray-500 w-5 h-5" />
              </button>
              <Link
                title="New chat"
                className="flex justify-center items-center"
                href="/"
              >
                <FaPlus className="text-gray-500 w-5 h-5" />
              </Link>
            </div>
            <div>
              <button
                onClick={startRecording}
                type="button"
                disabled={isRecording}
                className="m-2 border p-1"
              >
                <PiRecordFill />
              </button>
              <button
                onClick={stopRecording}
                type="button"
                disabled={!isRecording}
                className="m-2 border p-1"
              >
                <FaCirclePause />
              </button>
            </div>
            <div className="text-xs font-bold text-gradient">
              By masaischool.com
            </div>
          </div>
          <audio
            ref={audioRef}
            controls
            style={{ display: "block" }}
            className="m-2"
          />
        </div>
        {/* Chat Boat Button */}
        {open ? (
          <button
            onClick={handleBoatClick}
            className="flex justify-center items-center p-1.5 bg-blue-600 rounded-full"
          >
            <RxCaretDown className="text-white w-10 h-10" />
          </button>
        ) : (
          <button
            onClick={handleBoatClick}
            className="flex justify-center items-center p-1.5 rounded-full"
          >
            <img src={"/chatboat.jpg"} alt="" className="rounded-full" />
          </button>
        )}
      </div>
    </main>
  );
}
