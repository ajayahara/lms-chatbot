import { useState} from "react";
import { RxCaretDown } from "react-icons/rx";
// import MasaiBot from "src/assets/Masai-bot.svg"
import ChatHistory from "./ChatHistory";
import { FaArrowLeftLong } from "react-icons/fa6";
import ChatMessages from "./ChatMessages";


export default function AIBot() {
  const [open, setOpen] = useState<boolean>(false);
  const [chatTab, setChatTab] = useState(false);
  const [interactionId , setInteractionId] = useState(null)

  const handleBoatClick = () => {
    setOpen(!open);
    return;
  };

  const toggleChatTab = (id : any) => {
    setChatTab(!chatTab)
    setInteractionId(id)
  }

  const handleInteractionId = (id : any) => {
    setInteractionId(id)
  }

  return (
    <main
      className={`fixed bottom-0 left-0 right-0 flex justify-center items-end z-50 `}
    >
      <div className="w-1/4 absolute bottom-2 right-2 z-50 flex flex-col items-end gap-3">
        {/* Chat Ui */}
        <div
          className={`w-full h-[60vh] rounded-lg shadow-2xl border border-gray-200 flex flex-col justify-between bg-white overflow-scroll ${!open ? "hidden transition-all" : ""
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
          {chatTab ? <div>
            <div>
              <ChatMessages interactionId = {interactionId} setInteractionId={setInteractionId}/>
            </div>
            <div className="p-2" ><FaArrowLeftLong onClick={() => toggleChatTab(null)} className="cursor-pointer"/></div>
          </div> :
          <div><ChatHistory toggleChatTab={toggleChatTab} handleInteractionId={handleInteractionId}/></div>}
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
          <button onClick={handleBoatClick}
            className="flex justify-center items-center p-1.5 rounded-full"
          >
            {/* <img src={MasaiBot} alt="" className="rounded-full" /> */}
            <img src={"chatboat.jpg"} alt="" className="rounded-full" />
          </button>
        )}
      </div>
    </main>
  );
}
