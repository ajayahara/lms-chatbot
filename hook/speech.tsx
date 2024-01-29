import { useEffect, useState } from "react";

type OnResultCallback = (result: string) => void;

export const useVoiceRecognition = (onResultCallback: OnResultCallback) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionInstance.continuous = true;
      recognitionInstance.lang = "En-IN";

      recognitionInstance.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        onResultCallback(result);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  }, [onResultCallback]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return { startListening, stopListening };
};

export const useTextToSpeech = () => {
    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
  
        // Adjust pitch, rate, and volume for a more natural sound
        utterance.pitch = 1; // 0 is lowest, 2 is highest
        utterance.rate = 1; // 0.1 is slowest, 10 is fastest
        utterance.volume = 1; // 0 is lowest, 1 is highest
  
        window.speechSynthesis.speak(utterance);
      } else {
        console.error("Text-to-speech is not supported in this browser.");
      }
    };
  
    return { speak };
  };
  
// export const useTextToSpeech = () => {
//   const speak = (text: string) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(utterance);
//     } else {
//       console.error("Text-to-speech is not supported in this browser.");
//     }
//   };

//   return { speak };
// };
