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
          ? "mic-active bg-alert/20 border-alert text-alert font-bold"
          : "bg-ink/70 border-white/10 text-mist hover:border-signal/40 hover:text-signal"
      }`}
    >
      {listening ? (
        <>
          <MicOff className="h-3.5 w-3.5 text-alert animate-bounce" />
          <span>Recording… tap to finish</span>
        </>
      ) : (
        <>
          <Mic className="h-3.5 w-3.5 text-signal" />
          <span>Speak Voice Input</span>
        </>
      )}
    </button>
  );
}
