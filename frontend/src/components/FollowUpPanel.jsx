import { useState } from "react";
import api from "../api/axios";
import { HelpCircle, Sparkles, Check, ArrowRight } from "lucide-react";

export default function FollowUpPanel({ result, onRefined }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = result.followUpQuestions || [];
  if (questions.length === 0) return null;

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/refine", {
        englishText: result.englishText,
        classification: result.classification,
        answers,
      });
      onRefined(res.data);
    } catch {
      setError("Couldn't process your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.values(answers).filter((v) => v && String(v).trim().length > 0).length;

  return (
    <div className="cyber-card rounded-2xl p-5 md:p-6 space-y-5 border-signal/30 shadow-glow-signal animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <HelpCircle className="h-4 w-4 text-signal animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-signal font-semibold">
            Clarification Questionnaire
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Answer what you can to help our intelligence engine determine exact legal jurisdiction and platform freeze protocols.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-ink/50 p-3.5 rounded-xl border border-white/5">
            <p className="text-xs font-medium text-white mb-2.5">{q.text}</p>
            {q.type === "yesno" ? (
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => {
                  const isSelected = answers[q.id] === opt.toLowerCase();
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswer(q.id, opt.toLowerCase())}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        isSelected
                          ? opt === "Yes"
                            ? "bg-alert/20 border-alert text-alert shadow-glow-alert"
                            : "bg-signal/20 border-signal text-signal shadow-glow-signal"
                          : "bg-ink/70 border-white/10 text-mist hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {isSelected && <Check className="inline h-3 w-3 mr-1" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                value={answers[q.id] || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Enter details…"
                className="w-full bg-ink/70 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-mist/40 focus:outline-none focus:ring-1 focus:ring-signal"
              />
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-alert text-xs font-mono">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting || answeredCount === 0}
        className="w-full py-3 rounded-xl bg-signal text-ink font-bold text-xs hover:brightness-110 shadow-glow-signal transition disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {submitting ? (
          "Refining Classification…"
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            Update Incident with Answers ({answeredCount} answered)
          </>
        )}
      </button>

      <p className="text-[11px] text-mist/70 font-mono text-center">
        Optional step. You may proceed and download the draft directly below.
      </p>
    </div>
  );
}
