import { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

const SPEECH_LOCALES = { eng_Latn: "en-IN", hin_Deva: "hi-IN", kan_Knda: "kn-IN" };

export default function VoiceInput({ langCode, onResult }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!supported) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LOCALES[langCode] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => onResult(event.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!supported) {
    return <span className="text-xs text-mist/60 italic font-mono">Voice input requires Chrome/Edge.</span>;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
        listening
          ? "bg-red-50 border-red-200 text-red-600 font-bold shadow-[0_12px_20px_-16px_rgba(239,68,68,0.8)]"
          : "bg-white border-emerald-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 shadow-sm"
      }`}
    >
      {listening ? (
        <>
          <MicOff className="h-3.5 w-3.5 text-red-500 animate-bounce" />
          <span>Recording… tap to finish</span>
        </>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5 text-emerald-600" />
          <span>Speak Voice Input</span>
        </>
      )}
    </button>
  );
}
