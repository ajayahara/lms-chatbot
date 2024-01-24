import { useEffect, useState } from "react";

let recognization: any = null;
if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
  recognization = new webkitSpeechRecognition();
  recognization.continuous = true;
  recognization.lang = "en-US";
}
export const useRecognization = () => {
  const [text, setText] = useState<string | null>("");
  const [isListining, setIsListining] = useState<boolean>(false);
  useEffect(() => {
    if (!recognization) return;
    recognization.onresult = (event: SpeechRecognitionEvent) => {
        setText(event.results[0][0].transcript)
      recognization.stop();
      setIsListining(false);
    };
  }, []);
  const startListining = () => {
    setText("");
    setIsListining(true);
    recognization.start();
  };
  const stopListining = () => {
    setIsListining(false);
    recognization.stop();
  };
  return {
    text,
    isListining,
    startListining,
    stopListining,
    hasSupportRecognization: !!recognization,
  };
};
