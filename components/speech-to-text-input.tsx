import React, { useState, useEffect } from 'react';
import { MicrophoneIcon} from '@heroicons/react/24/solid';

declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognition) => void;
    onstart: () => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionResult) => void;
    start: () => void;
    stop: () => void;
  }
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}


interface SpeechToTextInputProps {
  onTranscription: (text: string) => void;
}

const SpeechToTextInput: React.FC<SpeechToTextInputProps> = ({ onTranscription }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
          const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition);
          const newRecognition = new SpeechRecognition();
          newRecognition.continuous = false;
          newRecognition.interimResults = true; // Enable interim results
          newRecognition.lang = 'en-US';
    
          newRecognition.onresult = (event: any) => {
            let transcript = Array.from(event.results)
              .map((result: any) => result[0])
              .map((result: any) => result.transcript)
              .join('');
            onTranscription(transcript);
          };
    
          newRecognition.onstart = () => {
            setIsListening(true);
          };
    
          newRecognition.onend = () => {
            setIsListening(false);
          };
    
          newRecognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
          };

          setRecognition(newRecognition);
        } else {
          console.log('Speech Recognition API not supported in this browser.');
        }
    
        return () => {
          if (recognition) {
            recognition.stop();
          }
        };
      }, [onTranscription]);

      const toggleListening = () => {
        if (recognition) {
          if (isListening) {
            recognition.stop();
          } else {
            recognition.start();
          }
        }
      };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      <MicrophoneIcon className={`h-5 w-5 ${isListening ? 'text-red-500' : ''}`} aria-hidden="true" />
    </button>
  );
};

export default SpeechToTextInput;