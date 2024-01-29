import { useEffect, useState } from "react";

export const useRecognization = () => {
  const [recognization, setRecognization] = useState<SpeechRecognition | null>(
    null
  );
  const [text, setText] = useState<string>("");
  const [isListining, setIsListining] = useState<boolean>(false);
  const startListining = () => {
    if (!recognization) return;
    setText("");
    setIsListining(true);
    recognization.start();
  };
  const stopListining = () => {
    if (!recognization) return;
    setIsListining(false);
    recognization.stop();
  };

  useEffect(() => {
    if (!text) return;
    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(
      text
    );
    const voices: SpeechSynthesisVoice[] = speechSynthesis.getVoices();
    utterance.voice = voices[2] || voices[5];
    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
  }, [text]);
  useEffect(() => {
    const SpeechRecognition: SpeechRecognition | null =
      new window.webkitSpeechRecognition() || null;
    if (SpeechRecognition) {
      SpeechRecognition.continuous = true;
      SpeechRecognition.lang = "en-US";
      setRecognization(SpeechRecognition);
    }
  }, []);
  useEffect(() => {
    if (!recognization) return;
    recognization.onresult = (event: SpeechRecognitionEvent):void => {
      const results:SpeechRecognitionResultList = event.results;
      setText(
        (preText) => preText + " " + results[results.length - 1][0].transcript
      );
    };
    recognization.onstart = () => {
      console.log("Sound recognization start");
    };
    recognization.onend = () => {
      setIsListining(false);
      recognization.stop();
    };
    recognization.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("Error occured", event);
    };
  }, [recognization]);
  return {
    text,
    isListining,
    startListining,
    stopListining,
  };
};
