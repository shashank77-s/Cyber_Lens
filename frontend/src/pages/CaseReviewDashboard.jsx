import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Avatar, StatCard, StatusBadge, UrgencyBadge } from "../components/UIKit";
import EventTimeline from "../components/EventTimeline";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  CreditCard,
  Hash,
  Phone,
  Scale,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertOctagon
} from "lucide-react";

const STATUSES = ["Filed", "Under Review", "Resolved", "Rejected"];

export default function CaseReviewDashboard() {
  const { showToast } = useToast();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const loadCases = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cases");
      setCases(res.data.cases || []);
    } catch (err) {
      console.error("Review dashboard fetch error:", err);
      const msg = err.response?.data?.error || "Failed to load complaints.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const stats = useMemo(() => {
    const counts = { Filed: 0, "Under Review": 0, Resolved: 0, Rejected: 0 };
    cases.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.user?.name?.toLowerCase().includes(q) ||
        c.user?.email?.toLowerCase().includes(q) ||
        c.classification?.predictedType?.toLowerCase().includes(q) ||
        c.englishText?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [cases, search, statusFilter]);

  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      const res = await api.patch(`/cases/${id}/status`, { status, adminNote: noteDrafts[id] });
      setCases((prev) => prev.map((c) => (c._id === id ? res.data.case : c)));
      showToast(`Case marked as "${status}"`);
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't update this case.", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 max-w-6xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan">
              Investigation Registry
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Review Complaints
          </h1>
          <p className="text-mist text-sm mt-1">
            {cases.length} incident reports submitted by citizens for evaluation.
          </p>
        </div>

        <button
          onClick={loadCases}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl cyber-card border border-white/10 text-xs font-mono text-mist-light hover:text-signal hover:border-signal/40 transition self-start md:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-signal" : ""}`} />
          Refresh Registry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard label="Filed / New" value={stats.Filed} accent="blue" icon={Clock} />
        <StatCard label="Under Review" value={stats["Under Review"]} accent="amber" icon={AlertTriangle} />
        <StatCard label="Resolved" value={stats.Resolved} accent="signal" icon={CheckCircle2} />
        <StatCard label="Rejected" value={stats.Rejected} accent="alert" icon={XCircle} />
      </div>

      {/* Filter & Search Bar */}
      <div className="cyber-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
          <input
            type="text"
            placeholder="Search by complainant name, email, or incident type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ink/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/50 focus:outline-none focus:ring-2 focus:ring-signal/40"
          />
        </div>

        <div className="flex items-center gap-2 bg-ink/60 border border-white/10 rounded-xl px-3 py-1.5">
          <Filter className="h-3.5 w-3.5 text-mist" />
          <span className="text-xs text-mist font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-panel">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-panel">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="cyber-card rounded-2xl p-16 text-center">
          <div className="inline-block h-8 w-8 rounded-full border-2 border-signal border-t-transparent animate-spin mb-3" />
          <p className="text-mist font-mono text-sm">Querying case files…</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="cyber-card border border-alert/40 rounded-2xl p-6 text-center bg-alert/5">
          <AlertOctagon className="h-8 w-8 text-alert mx-auto mb-2" />
          <p className="text-alert font-semibold mb-1">Failed to Load Complaints</p>
          <p className="text-mist text-xs mb-4">{error}</p>
          <button
            onClick={loadCases}
            className="px-4 py-2 rounded-xl bg-alert/20 border border-alert/40 text-alert text-xs font-semibold hover:bg-alert/30 transition"
          >
            Retry Request
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCases.length === 0 && (
        <div className="cyber-card rounded-2xl p-16 text-center border border-dashed border-white/10">
          <FileText className="h-10 w-10 text-mist/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Complaints Found</h3>
          <p className="text-mist text-xs">
            {cases.length === 0 ? "No complaints submitted yet." : "No complaints match your search query."}
          </p>
        </div>
      )}

      {/* Cases List */}
      {!loading && !error && filteredCases.length > 0 && (
        <div className="space-y-4">
          {filteredCases.map((c) => {
            const isExpanded = expandedId === c._id;
            const dateStr = new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={c._id}
                className="cyber-card cyber-card-hover rounded-2xl p-5 md:p-6 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.user?.name || "Citizen"} size="h-10 w-10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white capitalize text-base">
                          {c.classification?.predictedType}
                        </p>
                        {c.legalInfo?.urgency && (
                          <UrgencyBadge urgency={c.legalInfo.urgency} />
                        )}
                      </div>
                      <p className="text-xs text-mist font-mono mt-0.5">
                        <span className="text-white/80">{c.user?.name || "Unknown"}</span> ·{" "}
                        <span>{c.user?.email || "No email"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="text-xs font-mono text-mist flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-mist/60" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 mb-3 bg-ink/40 p-3.5 rounded-xl border border-white/5 leading-relaxed">
                  {c.englishText || c.originalText}
                </p>

                {/* Entity Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {c.entities?.amounts?.map((amt, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      <CreditCard className="h-3 w-3" />
                      {amt}
                    </span>
                  ))}
                  {c.entities?.upiIds?.map((upi, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-cyan/10 text-cyan border border-cyan/30">
                      <Hash className="h-3 w-3" />
                      {upi}
                    </span>
                  ))}
                  {c.entities?.phoneNumbers?.map((ph, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      <Phone className="h-3 w-3" />
                      {ph}
                    </span>
                  ))}
                  {c.legalInfo?.sections?.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      <Scale className="h-3 w-3" />
                      {c.legalInfo.sections[0]}
                    </span>
                  )}
                </div>

                {/* Quick Status and Note Action Bar */}
                <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center bg-panel-card/60 p-3 rounded-xl border border-white/10">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    disabled={savingId === c._id}
                    className="bg-ink border border-white/15 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-signal"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Add an official note for the citizen…"
                    defaultValue={c.adminNote}
                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [c._id]: e.target.value }))}
                    className="flex-1 bg-ink/70 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-mist/50 focus:outline-none focus:ring-1 focus:ring-signal"
                  />

                  <button
                    onClick={() => updateStatus(c._id, c.status)}
                    disabled={savingId === c._id}
                    className="px-4 py-2 rounded-lg bg-signal text-ink text-xs font-semibold hover:brightness-110 disabled:opacity-50 transition shadow-glow-signal shrink-0"
                  >
                    {savingId === c._id ? "Saving…" : "Save Note"}
                  </button>
                </div>

                {c.reviewedBy && (
                  <p className="mt-2 text-[11px] font-mono text-mist">
                    Last audited by <span className="text-white/80">{c.reviewedBy.name}</span> ({c.reviewedBy.role})
                  </p>
                )}

                {/* Toggle details */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c._id)}
                    className="text-xs font-mono text-mist hover:text-signal flex items-center gap-1 transition"
                  >
                    {isExpanded ? <><ChevronUp className="h-3 w-3" /> Less</> : <><ChevronDown className="h-3 w-3" /> Details & Guidance</>}
                  </button>

                  <span className="text-[11px] font-mono text-mist/60">ID: {c._id}</span>
                </div>

                {isExpanded && c.legalInfo && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2 animate-fade-in">
                    {c.legalInfo.guidance && (
                      <p className="text-mist bg-ink/40 p-3 rounded-lg border border-white/5">
                        <span className="text-signal font-semibold font-mono">Guidance: </span>
                        {c.legalInfo.guidance}
                      </p>
                    )}
                  </div>
                )}

                <EventTimeline caseId={c._id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
