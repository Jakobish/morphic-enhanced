import React, { useState, useEffect } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void; // Changed to SpeechRecognitionEvent
    onstart: () => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void; // Changed to SpeechRecognitionErrorEvent
    start: () => void;
    stop: () => void;
  }
  interface SpeechRecognitionEvent extends Event { // Define SpeechRecognitionEvent
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }
  interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
  }
  interface SpeechRecognitionAlternative {
    transcript: string;
  }
  interface SpeechRecognitionErrorEvent extends Event{
    error : string
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
  const [fullTranscript, setFullTranscript] = useState<string>('');

  useEffect(() => {
    let newRecognition: SpeechRecognition | null = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      newRecognition = new ((window.SpeechRecognition || window.webkitSpeechRecognition) as new () => SpeechRecognition)();
      newRecognition.continuous = true; // Keep listening until stopped
      newRecognition.interimResults = true; // Get partial results
      newRecognition.lang = 'en-US'; // Set language

      newRecognition.onstart = () => {
        setIsListening(true);
      };

      newRecognition.onend = () => {
        setIsListening(false);
        //send to parent the final transcript
        onTranscription(fullTranscript);
      };

      newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setFullTranscript('')
        };

      newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.results.length - 1; i >= 0; i--) {
          const result = event.results[i];
          const alternative = result[0];
          if(result.isFinal){
            // Add the final transcript to full transcript
            setFullTranscript(prevTranscript => prevTranscript + " "+alternative.transcript);
          }else{
            interimTranscript += alternative.transcript;
          }
        }
        // Send transcript to parent
        if (interimTranscript){
          onTranscription(fullTranscript + " "+interimTranscript);
        }
      };

      setRecognition(newRecognition);
    } else {
      console.log('Speech Recognition API not supported in this browser.');
    }

    return () => {
      if (newRecognition) {
        newRecognition.stop();
      }
    };
  }, [onTranscription]);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setFullTranscript('')
      } else {
        setFullTranscript('')
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
