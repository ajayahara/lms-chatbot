import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// import { AuthContext } from 'src/context/AuthContext';
import { IoIosArrowDroprightCircle, IoIosArrowForward } from "react-icons/io";
import TimeAgo from "timeago-react";

type ChatHistoryProps = {
  toggleChatTab: (id: any) => void;
  handleInteractionId: (id: any) => void;
};

type Interaction = {
  id: number;
  user_id: number;
  title: string;
  ticket_id: number | null;
  started_at: string;
  ended_at?: string | null;
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ toggleChatTab }) => {
  const [allInteractions, setAllInteractions] = useState<Interaction[]>([
    {
      id: 1,
      user_id: 101,
      title: "Meeting with Client",
      ticket_id: 123,
      started_at: "2024-01-29T10:00:00",
      ended_at: "2024-01-29T11:30:00",
    },
    {
      id: 2,
      user_id: 102,
      title: "Support Call",
      ticket_id: null,
      started_at: "2024-01-30T14:00:00",
      ended_at: "2024-01-29T19:32:00",
    },
  ]);
  // const {currentUser} = useContext(AuthContext)
  const currentUser: any = { id: 1 };

  useEffect(() => {
    getInteractions();
  }, []);

  const getInteractions = () => {
    // Fetch interactions from the server
    axios
      .get(
        `${process.env.REACT_APP_GQL_BASE_URL}/support?user_id=${currentUser.id}`
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllInteractions(res.data);
        } else {
          console.error("Data is not an array:", res.data);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {/* New Chat Card */}
      <div
        className="flex justify-between items-center px-2 shadow-lg cursor-pointer"
        onClick={() => toggleChatTab(null)}
      >
        <div>
          <p className="mx-2 my-5 font-bold text-[20px]">Start a new Chat</p>
        </div>
        <div>
          <IoIosArrowDroprightCircle className="text-[24px] text-blue-800" />
        </div>
      </div>
      {/* Chat history */}
      <div>
        {allInteractions &&
          allInteractions.map((interaction) => (
            <div
              className="mx-2 my-5 shadow-md p-2 cursor-pointer flex justify-between items-center"
              onClick={() => toggleChatTab(interaction.id)}
              key={interaction.id}
            >
              <div>{interaction.title.slice(0, 30)}...</div>
              {interaction.ended_at?<TimeAgo datetime={interaction.ended_at} locale="en_US" />:null}
              <div>
                <IoIosArrowForward />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatHistory;
