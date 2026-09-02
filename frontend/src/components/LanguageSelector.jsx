import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "eng_Latn", label: "English" },
  { code: "hin_Deva", label: "हिंदी (Hindi)" },
  { code: "kan_Knda", label: "ಕನ್ನಡ (Kannada)" },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-mist">
        <Globe className="h-3.5 w-3.5 text-signal" />
        <span>Language:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => {
          const isSelected = value === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onChange(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                isSelected
                  ? "bg-signal text-ink font-bold shadow-glow-signal"
                  : "bg-ink/70 text-mist border border-white/10 hover:border-signal/40 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
