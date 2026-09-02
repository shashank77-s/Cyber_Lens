import { useState } from "react";
import { 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  CheckSquare, 
  Layers, 
  Scale, 
  Clock, 
  Info, 
  Check, 
  Cpu, 
  CreditCard, 
  Hash, 
  Phone, 
  Calendar,
  PhoneCall,
  ExternalLink,
  AlertOctagon,
  Lock,
  WifiOff,
  CheckCircle2,
  FileText
} from "lucide-react";
import { UrgencyBadge } from "./UIKit";

function EntityChip({ icon: Icon, label, values }) {
  const hasValues = values && values.length > 0;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-mist" />
        <span className="text-xs font-mono uppercase tracking-wider text-mist">{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:justify-end">
        {hasValues ? (
          values.map((v, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-ink/80 text-white border border-white/10"
            >
              {v}
            </span>
          ))
        ) : (
          <span className="text-xs text-mist/50 italic font-mono">None detected</span>
        )}
      </div>
    </div>
  );
}

const DEFAULT_VICTIM_ACTIONS = [
  {
    priority: "CRITICAL",
    action: "Call National Cybercrime Helpline (1930)",
    detail: "Dial 1930 immediately within the golden hour to freeze unauthorized bank debits and UPI transfers.",
  },
  {
    priority: "CRITICAL",
    action: "Contact Bank Fraud Department & Freeze Accounts",
    detail: "Call your bank's 24x7 emergency helpline to block your debit/credit card, disable UPI services, and freeze compromised net banking.",
  },
  {
    priority: "HIGH",
    action: "Isolate Compromised Devices & Remote Access",
    detail: "If screen-sharing apps (AnyDesk, TeamViewer) or unknown APKs were installed, turn on Airplane Mode or disconnect from Wi-Fi immediately. Uninstall unauthorized apps.",
  },
  {
    priority: "HIGH",
    action: "Reset Passwords & Enable Multi-Factor Authentication",
    detail: "Change passwords on your email, banking, and social accounts from a clean, secure device. Terminate all active sessions and enable app-based 2FA.",
  },
  {
    priority: "IMPORTANT",
    action: "Preserve Unedited Digital Evidence",
    detail: "Do not delete messages or call logs. Take full screenshots of transaction UTR IDs, debit SMS alerts, chat transcripts, and fraudster numbers.",
  },
  {
    priority: "IMMEDIATE",
    action: "File Official Report on cybercrime.gov.in",
    detail: "Lodge a formal complaint on the National Cyber Crime Reporting Portal using this generated complaint PDF.",
  },
];

export default function DraftPreview({ result, onDownload, downloading }) {
  const { classification, entities, legalInfo, englishText, timeline, platformGuidance } = result;
  const confidencePct = Math.round((classification.confidence || 0) * 100);
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Determine actions to show
  const actionSteps = (legalInfo.actionSteps && legalInfo.actionSteps.length > 0)
    ? legalInfo.actionSteps
    : DEFAULT_VICTIM_ACTIONS;

  return (
    <div className="cyber-card rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl border border-white/10 animate-fade-in">
      {/* Classification Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-signal" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-signal">
              AI Incident Classification
            </span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white capitalize">
            {classification.predictedType}
          </h3>
        </div>
        {legalInfo.urgency && (
          <div className="self-start md:self-auto">
            <UrgencyBadge urgency={legalInfo.urgency} />
          </div>
        )}
      </div>

      {/* Confidence Bar */}
      <div className="bg-ink/50 p-3.5 rounded-xl border border-white/5">
        <div className="flex justify-between text-xs font-mono text-mist mb-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-signal" />
            Algorithm Model Confidence
          </span>
          <span className="text-signal font-bold">{confidencePct}%</span>
        </div>
        <div className="h-2 bg-ink rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan via-signal to-emerald-400 rounded-full transition-all duration-700 shadow-glow-signal"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* SECTION: IMMEDIATE ACTIONS FOR VICTIM (DO THIS NOW) */}
      <div className="cyber-card rounded-2xl p-5 md:p-6 border-alert/30 bg-gradient-to-br from-panel to-alert/5 shadow-glow-alert space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-alert/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-alert/20 text-alert border border-alert/30">
              <AlertOctagon className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Immediate Actions For Victim
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-alert/20 text-alert border border-alert/30">
                  Do This Right Now
                </span>
              </h4>
              <p className="text-xs text-mist">
                Protect yourself and stop further financial loss by following these prioritized steps:
              </p>
            </div>
          </div>

          {/* Quick Helpline Buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-alert text-white font-mono font-bold text-xs hover:brightness-110 shadow-glow-alert transition"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Dial 1930 (Helpline)</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-panel-card border border-white/15 text-xs font-mono text-mist-light hover:text-signal hover:border-signal/40 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>cybercrime.gov.in</span>
            </a>
          </div>
        </div>

        {/* Action Steps List */}
        <div className="space-y-3 pt-1">
          {actionSteps.map((step, idx) => {
            const isDone = completedSteps[idx];
            const isCritical = step.priority === "CRITICAL";
            const isHigh = step.priority === "HIGH";

            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                  isDone
                    ? "bg-signal/5 border-signal/30 opacity-70"
                    : isCritical
                    ? "bg-ink/80 border-alert/40 hover:border-alert"
                    : isHigh
                    ? "bg-ink/70 border-amber-400/30 hover:border-amber-400"
                    : "bg-ink/60 border-white/10 hover:border-white/25"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-signal border-signal text-ink"
                        : "border-white/20 bg-ink"
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        isCritical
                          ? "bg-alert/20 text-alert border border-alert/30"
                          : isHigh
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-signal/20 text-signal border border-signal/30"
                      }`}
                    >
                      {step.priority || "STEP"} {idx + 1}
                    </span>
                    <p
                      className={`text-sm font-semibold transition ${
                        isDone ? "line-through text-mist" : "text-white"
                      }`}
                    >
                      {step.action}
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clarified Guidance Note if present */}
        {legalInfo.guidance && (
          <div className="bg-panel-card/60 p-3 rounded-xl border border-white/10 text-xs text-mist-light flex items-start gap-2">
            <Info className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-cyan font-mono">Summary: </strong>
              {legalInfo.guidance}
            </span>
          </div>
        )}
      </div>

      {/* Processed Description */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-mist block mb-1.5">
          Standardized Incident Summary
        </span>
        <div className="bg-ink/60 border border-white/10 rounded-xl p-4 text-sm text-slate-200 leading-relaxed">
          {englishText}
        </div>
      </div>

      {/* Extracted Entities */}
      <div className="bg-ink/40 rounded-xl p-4 border border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-signal font-semibold block mb-2">
          Structured Forensic Extraction
        </span>
        <EntityChip icon={CreditCard} label="Extracted Amount(s)" values={entities.amounts} />
        <EntityChip icon={Calendar} label="Incident Date(s)" values={entities.dates} />
        <EntityChip icon={Hash} label="UPI Identifier(s)" values={entities.upiIds} />
        <EntityChip icon={Phone} label="Phone Number(s)" values={entities.phoneNumbers} />
        <EntityChip icon={Layers} label="Transaction Ref(s)" values={entities.transactionRefs} />
      </div>

      {/* Timeline */}
      {timeline && timeline.length > 1 && (
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-mist block mb-3">
            Reconstructed Chronological Timeline
          </span>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-signal/20">
            {timeline.map((step) => (
              <div key={step.step} className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-panel-card border-2 border-signal text-signal text-[10px] font-bold font-mono flex items-center justify-center shadow-glow-signal">
                  {step.step}
                </span>
                <div className="bg-ink/40 p-3 rounded-xl border border-white/5 flex-1">
                  <p className="text-sm text-white/90">{step.text}</p>
                  {(step.date || step.time) && (
                    <span className="mt-1 inline-block text-xs text-signal font-mono">
                      {[step.date, step.time].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Guidance */}
      {platformGuidance && platformGuidance.length > 0 && (
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-mist block mb-2.5">
            Platform Mitigation Steps
          </span>
          <div className="space-y-2.5">
            {platformGuidance.map((p) => (
              <div key={p.platform} className="bg-ink/50 rounded-xl p-3.5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold font-mono text-signal capitalize">{p.platform}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-mist border border-white/10 rounded-full px-2 py-0.5">
                    {p.category}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {p.steps.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-signal font-bold">›</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Sections */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-mist block mb-2">
          Applicable IT Act / IPC Sections
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {legalInfo.sections.map((s, i) => (
            <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 flex items-center gap-2.5">
              <Scale className="h-4 w-4 text-purple-300 shrink-0" />
              <span className="text-xs font-mono text-purple-200">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Checklist */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-mist block mb-2">
          Recommended Evidence Checklist
        </span>
        <ul className="space-y-2">
          {legalInfo.evidence.map((e, i) => (
            <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-ink/40 p-2.5 rounded-lg border border-white/5">
              <CheckSquare className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Download Button */}
      <button
        onClick={onDownload}
        disabled={downloading}
        className="w-full py-3.5 rounded-xl bg-signal text-ink font-bold text-sm hover:brightness-110 shadow-glow-signal transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {downloading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
            Compiling Formal Complaint PDF…
          </span>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download Structured Cybercrime Complaint (PDF)
          </>
        )}
      </button>

      <p className="text-[11px] text-mist font-mono text-center leading-relaxed">
        CyberShield AI is an automated drafting aid compliant with Indian Cyber Law (IT Act 2000). Always submit verified drafts to cybercrime.gov.in or your local cyber police station.
      </p>
    </div>
  );
}
