import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { StatusBadge, UrgencyBadge } from "../components/UIKit";
import EventTimeline from "../components/EventTimeline";
import { FileText, Plus, Calendar, ShieldCheck, MessageSquare, AlertCircle } from "lucide-react";

export default function MyCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/cases/mine")
      .then((res) => setCases(res.data.cases || []))
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load your complaints.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-slate-100 max-w-4xl mx-auto px-4 md:px-8 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-signal">
              Citizen Registry
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            My Complaints
          </h1>
          <p className="text-mist text-sm mt-1">
            Track status updates, reviewer determinations, and activity timelines for your submitted reports.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-signal to-cyan text-ink font-bold text-xs hover:brightness-110 hover:-translate-y-0.5 shadow-glow-signal transition-all duration-300 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          File New Complaint
        </Link>
      </div>

      {loading && (
        <div className="cyber-card rounded-2xl p-16 text-center">
          <div className="inline-block h-8 w-8 rounded-full border-2 border-signal border-t-transparent animate-spin mb-3" />
          <p className="text-mist font-mono text-sm">Loading your cases…</p>
        </div>
      )}

      {!loading && error && (
        <div className="cyber-card border border-alert/40 rounded-2xl p-6 text-center bg-alert/5">
          <AlertCircle className="h-8 w-8 text-alert mx-auto mb-2" />
          <p className="text-alert font-semibold mb-1">{error}</p>
        </div>
      )}

      {!loading && !error && cases.length === 0 && (
        <div className="cyber-card rounded-2xl p-16 text-center border border-dashed border-white/10">
          <FileText className="h-12 w-12 text-mist/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg text-white mb-1">
            No complaints filed yet
          </h3>
          <p className="text-mist text-sm max-w-md mx-auto mb-6">
            If you've experienced financial fraud, phishing, or identity theft, submit an incident report to receive legal structure and tracking.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-signal to-cyan text-ink font-bold text-xs hover:brightness-110 hover:-translate-y-0.5 shadow-glow-signal transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            File Incident Report
          </Link>
        </div>
      )}

      {!loading && !error && cases.length > 0 && (
        <div className="space-y-4">
          {cases.map((c) => {
            const dateStr = new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={c._id}
                className="cyber-card cyber-card-hover rounded-2xl p-6 transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-display font-bold text-white text-lg capitalize group-hover:text-signal/90 transition-colors duration-200">
                      {c.classification?.predictedType}
                    </span>
                    {c.legalInfo?.urgency && (
                      <UrgencyBadge urgency={c.legalInfo.urgency} />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="text-xs font-mono text-mist flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-mist/70" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-ink/40 p-3.5 rounded-xl border border-white/5">
                  {c.englishText || c.originalText}
                </p>

                {c.adminNote && (
                  <div className="mb-4 bg-cyan/5 border border-cyan/20 rounded-xl p-3.5 flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono font-semibold text-cyan uppercase tracking-wider mb-0.5">
                        Official Note From Reviewer
                      </p>
                      <p className="text-xs text-white/90 leading-relaxed">{c.adminNote}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] font-mono text-mist/60">
                    Tracking ID: {c._id}
                  </span>
                  <EventTimeline caseId={c._id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
