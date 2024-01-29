import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaRegPaperPlane } from "react-icons/fa6";
import { PiRecordFill } from "react-icons/pi";
import { FaCirclePause } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
// import { AuthContext } from 'src/context/AuthContext';
import { formatDate } from "@/lib/formatDate";
interface Message {
  id: number;
  interaction_id: number;
  message: string;
  user_id: number;
  sent_at: string;
}

type ChatMessagesProps = {
  interactionId: any;
  setInteractionId: any;
};

const assistant_id = Number(process.env.REACT_APP_BOT_USER_ID) || null;

const ChatMessages: React.FC<ChatMessagesProps> = ({
  interactionId,
  setInteractionId,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      interaction_id: 101,
      message: "Hello, how are you?",
      user_id: 1001,
      sent_at: "2024-01-29T08:30:00",
    },
    {
      id: 2,
      interaction_id: 102,
      message: "I'm doing well, thank you!",
      user_id: 1002,
      sent_at: "2024-01-29T09:00:00",
    },
    {
      id: 3,
      interaction_id: 103,
      message: "Any updates on the project?",
      user_id: 1003,
      sent_at: "2024-01-29T09:30:00",
    },
    {
      id: 4,
      interaction_id: 104,
      message: "Yes, we're making good progress.",
      user_id: 1004,
      sent_at: "2024-01-29T10:00:00",
    },
    {
      id: 5,
      interaction_id: 105,
      message: "That's great to hear!",
      user_id: 1005,
      sent_at: "2024-01-29T10:30:00",
    },
    {
      id: 6,
      interaction_id: 106,
      message: "Let me know if you need any assistance.",
      user_id: 1006,
      sent_at: "2023-01-28T11:00:00",
    },
  ]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const {currentUser} = useContext(AuthContext);
  const currentUser: any = { id: 1 };

  const getChatHistory = () => {
    if (interactionId !== null) {
      axios
        .get(
          `${process.env.REACT_APP_GQL_BASE_URL}/support/${interactionId}?user_id=${currentUser.id}`
        )
        .then((res) => {
          // setMessages(res.data)
        })
        .catch((err) => console.error(err));
    } else {
      // setMessages([])
    }
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    handleQuerySubmit();
  };

  const handleQuerySubmit = async () => {
    if (!query || loading) return;
    // setMessages((pre) => [...pre, { role: "user", content: query }]);
    setQuery("");
    setLoading(true);
    try {
      // console.log("MES", messages)
      // const response = await axios.post(`http://localhost:5000/support`, {
      //   "role": "user",
      //   "content": query
      // })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    let response;
    if (interactionId === null) {
      response = await fetch(
        `${process.env.REACT_APP_GQL_BASE_URL}/support?user_id=${currentUser.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
    } else {
      response = await fetch(
        `${process.env.REACT_APP_GQL_BASE_URL}/support/${interactionId}?user_id=${currentUser.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
    }

    if (response.ok) {
      // Assuming the backend sends the audio URL in the response
      // const responseData = await response.json()
      // const {audioBuffer, interaction_id} = responseData
      const responseData = await response.blob();
      // const audioBlob = new Blob([responseData.audioBuffer], { type: 'audio/wav' })
      playAudio(responseData);
      if (interactionId === null) {
        axios
          .get(
            `${process.env.REACT_APP_GQL_BASE_URL}/support?user_id=${currentUser.id}`
          )
          .then((res) => {
            console.log(res.data);
            setInteractionId(res.data[0].id);
          })
          .catch((err) => console.error(err));
      }
      console.log("INTERACTIONS ID", interactionId);
    } else {
      console.error("Error:", response.statusText);
    }
  };
  console.log(messages);
  return (
    <div>
      {/* Chat Messages */}
      <div className="flex flex-col gap-2 w-full p-2 h-3/4 overflow-y-scroll text-sm example">
        {messages.length > 0 &&
          messages.map((message, index) => {
            const isUser = message.user_id !== 1005;
            return (
              <div
                key={index}
                className={`max-w-64 text-white flex flex-col ${
                  isUser ? "self-end" : "self-start"
                }`}
              >
                <div className={`mb-1 flex items-center ${isUser?"justify-end":"justify-start"}`}>
                 {isUser?<RxAvatar className="w-6 h-6 text-gray-600"/> : <img
                    src="/chatboat.jpg"
                    alt="chat boat"
                    className="w-6 h-6 rounded-full"
                  />}
                </div>
                <div
                  className={`rounded-md py-2 px-2 ${
                    isUser ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  {message.message}
                </div>
                <div className={isUser?"text-left":"text-right"}>
                  <span className="text-black text-xs">
                    {isUser ? currentUser.name || "masai" : "Bot"}
                    ..{formatDate(message.sent_at)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      {/* Chat Input */}
      <div className="w-full flex gap-2 items-center p-2">
        <input
          type="text"
          placeholder="Enter your queries..."
          className="w-11/12 p-1 border-b border-gray-400 focus:outline-none rounded-md"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleEnterClick}
        />
        <button
          onClick={handleQuerySubmit}
          className="w-1/12 h-full flex flex-col justify-center items-center"
        >
          <FaRegPaperPlane className="text-gray-500 w-5 h-5" />
        </button>
      </div>
      {/* Chat Footer */}
      <div className="flex justify-between items-center px-2 pt-1 pb-3">
        <div className="flex gap-2">
          <button
            onClick={handleQuerySubmit}
            className="flex justify-center items-center"
          >
            <HiOutlineChatBubbleBottomCenterText className="text-gray-500 w-5 h-5" />
          </button>
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
  );
};

export default ChatMessages;
