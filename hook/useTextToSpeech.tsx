import { useEffect, useState } from "react";

export const useTextToSpeech = () => {
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    } else {
      console.error("Text-to-speech is not supported in this browser.");
    }
  }, []);

  const speak = (text: string) => {
    if (!synthesis) {
      console.error("SpeechSynthesis is not available.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
  };

  return { speak, hasSupportTextToSpeech: !!synthesis };
};
