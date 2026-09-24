import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Avatar, RoleBadge, StatCard, StatusBadge, UrgencyBadge } from "../components/UIKit";
import EventTimeline from "../components/EventTimeline";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserMinus,
  AlertOctagon,
  CreditCard,
  Hash,
  Calendar,
  Phone,
  Scale
} from "lucide-react";

const STATUSES = ["Filed", "Under Review", "Resolved", "Rejected"];

export default function AdminPanel() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints" | "users"
  
  // Complaints state
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [caseError, setCaseError] = useState("");
  const [searchCase, setSearchCase] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [savingCaseId, setSavingCaseId] = useState(null);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [expandedCaseId, setExpandedCaseId] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Stats state
  const [statsData, setStatsData] = useState(null);

  const fetchCases = async () => {
    setLoadingCases(true);
    setCaseError("");
    try {
      const res = await api.get("/cases");
      setCases(res.data.cases || []);
    } catch (err) {
      console.error("Fetch cases error:", err);
      try {
        const fallbackRes = await api.get("/admin/cases");
        setCases(fallbackRes.data.cases || []);
      } catch (fallbackErr) {
        const msg = fallbackErr.response?.data?.error || err.response?.data?.error || "Failed to load complaints.";
        setCaseError(msg);
        showToast(msg, "error");
      }
    } finally {
      setLoadingCases(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load users roster.";
      setUserError(msg);
      showToast(msg, "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data?.stats) {
        setStatsData(res.data.stats);
      }
    } catch {
      // Non-fatal, compute from loaded cases
    }
  };

  const refreshAll = () => {
    fetchCases();
    fetchUsers();
    fetchStats();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Filtered complaints
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const caseUrgency = c.legalInfo?.urgency?.toLowerCase() || "medium";
      const matchesUrgency = urgencyFilter === "All" || caseUrgency === urgencyFilter.toLowerCase();
      
      const q = searchCase.toLowerCase();
      const matchesSearch =
        !searchCase ||
        c.user?.name?.toLowerCase().includes(q) ||
        c.user?.email?.toLowerCase().includes(q) ||
        c.classification?.predictedType?.toLowerCase().includes(q) ||
        c.englishText?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q);

      return matchesStatus && matchesUrgency && matchesSearch;
    });
  }, [cases, searchCase, statusFilter, urgencyFilter]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchUser) return users;
    const q = searchUser.toLowerCase();
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q));
  }, [users, searchUser]);

  const officerOptions = useMemo(
    () => users.filter((u) => u.role === "officer" || u.role === "admin"),
    [users]
  );

  // Computed stats
  const computedStats = useMemo(() => {
    const counts = { Filed: 0, "Under Review": 0, Resolved: 0, Rejected: 0, highUrgency: 0 };
    cases.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
      if (c.legalInfo?.urgency === "high") counts.highUrgency += 1;
    });
    return {
      totalCases: statsData?.totalCases ?? cases.length,
      filed: statsData?.filed ?? counts.Filed,
      underReview: statsData?.underReview ?? counts["Under Review"],
      resolved: statsData?.resolved ?? counts.Resolved,
      rejected: statsData?.rejected ?? counts.Rejected,
      highUrgency: statsData?.highUrgency ?? counts.highUrgency,
      totalUsers: statsData?.totalUsers ?? users.length,
      officers: statsData?.officers ?? users.filter((u) => u.role === "officer").length,
    };
  }, [cases, users, statsData]);

  // Status update
  const handleUpdateStatus = async (id, status) => {
    setSavingCaseId(id);
    try {
      const res = await api.patch(`/cases/${id}/status`, {
        status,
        adminNote: noteDrafts[id],
      });
      setCases((prev) => prev.map((c) => (c._id === id ? res.data.case : c)));
      showToast(`Complaint status updated to "${status}"`);
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not update status.", "error");
    } finally {
      setSavingCaseId(null);
    }
  };

  // Toggle user role
  const handleToggleRole = async (user) => {
    if (user.role === "admin") return;
    const newRole = user.role === "officer" ? "user" : "officer";
    setUpdatingUserId(user._id);
    try {
      const res = await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: res.data.user.role } : u)));
      showToast(newRole === "officer" ? `Promoted ${user.name} to Cyber Officer` : `Reverted ${user.name} to Citizen role`);
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not update role.", "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleAssignOfficer = async (caseId, officerId) => {
    try {
      const res = await api.patch(`/cases/${caseId}/assign`, { officerId: officerId || null });
      setCases((prev) => prev.map((c) => (c._id === caseId ? res.data.case : c)));
      const assignedUser = officerOptions.find((u) => u._id === officerId);
      showToast(
        assignedUser
          ? `Complaint assigned to ${assignedUser.name}`
          : "Complaint assignment cleared"
      );
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.error || "Could not assign officer.", "error");
    }
  };

  return (
    <div className="min-h-screen text-slate-100 max-w-7xl mx-auto px-4 md:px-8 py-8 animate-slide-up">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700">
              Cyber Operations Command Center
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
            Admin Panel
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-100 text-emerald-700 border border-emerald-200">
              Root Authority
            </span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage all cybercrime reports, track investigation lifecycles, and control officer access credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-100 text-xs font-mono text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${(loadingCases || loadingUsers) ? "animate-spin text-emerald-700" : "text-emerald-700"}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Aggregate Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
        <StatCard
          label="Total Reports"
          value={computedStats.totalCases}
          accent="signal"
          icon={FileText}
        />
        <StatCard
          label="New / Filed"
          value={computedStats.filed}
          accent="blue"
          icon={Clock}
        />
        <StatCard
          label="Under Review"
          value={computedStats.underReview}
          accent="amber"
          icon={AlertTriangle}
        />
        <StatCard
          label="Resolved"
          value={computedStats.resolved}
          accent="cyan"
          icon={CheckCircle2}
        />
        <StatCard
          label="High Urgency"
          value={computedStats.highUrgency}
          accent="alert"
          icon={AlertOctagon}
        />
        <StatCard
          label="Officers"
          value={computedStats.officers}
          accent="mist"
          icon={ShieldCheck}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-emerald-100">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`flex items-center gap-2.5 px-5 py-3 border-b-2 font-medium text-sm transition-all ${
            activeTab === "complaints"
              ? "border-emerald-500 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-emerald-700"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Complaints Management</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
            activeTab === "complaints" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-slate-600"
          }`}>
            {cases.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2.5 px-5 py-3 border-b-2 font-medium text-sm transition-all ${
            activeTab === "users"
              ? "border-emerald-500 text-emerald-700 font-semibold"
              : "border-transparent text-slate-600 hover:text-emerald-700"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Officers & User Accounts</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
            activeTab === "users" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-slate-600"
          }`}>
            {users.length}
          </span>
        </button>
      </div>

      {/* TAB 1: COMPLAINTS MANAGEMENT */}
      {activeTab === "complaints" && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="cyber-card rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between border border-emerald-100 shadow-[0_18px_35px_-28px_rgba(16,70,42,0.25)]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700" />
              <input
                type="text"
                value={searchCase}
                onChange={(e) => setSearchCase(e.target.value)}
                placeholder="Search by complainant name, email, crime type, or details…"
                className="w-full bg-white border border-emerald-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 hover:border-emerald-200 transition-all duration-200"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1.5">
                <Filter className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-xs text-slate-700 font-mono">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-white text-slate-700">All Statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-white text-slate-700">{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-xs text-slate-700 font-mono">Urgency:</span>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-white text-slate-700">All Urgencies</option>
                  <option value="High" className="bg-white text-slate-700">High</option>
                  <option value="Medium" className="bg-white text-slate-700">Medium</option>
                  <option value="Low" className="bg-white text-slate-700">Low</option>
                </select>
              </div>

              {(searchCase || statusFilter !== "All" || urgencyFilter !== "All") && (
                <button
                  onClick={() => { setSearchCase(""); setStatusFilter("All"); setUrgencyFilter("All"); }}
                  className="text-xs text-slate-600 hover:text-emerald-700 underline px-2 py-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingCases && (
            <div className="cyber-card rounded-2xl p-16 text-center">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-signal border-t-transparent animate-spin mb-3" />
              <p className="text-mist font-mono text-sm">Querying secure complaints registry…</p>
            </div>
          )}

          {/* Error Message */}
          {!loadingCases && caseError && (
            <div className="cyber-card border border-alert/40 rounded-2xl p-6 text-center bg-alert/5">
              <AlertOctagon className="h-8 w-8 text-alert mx-auto mb-2" />
              <p className="text-alert font-semibold mb-1">Failed to Load Complaints</p>
              <p className="text-mist text-xs mb-4">{caseError}</p>
              <button
                onClick={fetchCases}
                className="px-4 py-2 rounded-xl bg-alert/20 border border-alert/40 text-alert text-xs font-semibold hover:bg-alert/30 transition"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingCases && !caseError && filteredCases.length === 0 && (
            <div className="cyber-card rounded-2xl p-16 text-center border border-dashed border-white/10">
              <FileText className="h-10 w-10 text-mist/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No Complaints Found</h3>
              <p className="text-mist text-xs max-w-md mx-auto">
                {cases.length === 0
                  ? "No cybercrime complaints have been submitted into the system yet."
                  : "No complaints match your active filter and search criteria."}
              </p>
            </div>
          )}

          {/* Complaints List */}
          {!loadingCases && !caseError && filteredCases.length > 0 && (
            <div className="space-y-4">
              {filteredCases.map((c) => {
                const isExpanded = expandedCaseId === c._id;
                const dateStr = new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={c._id}
                    className="cyber-card cyber-card-hover rounded-2xl p-5 md:p-6 transition-all duration-300 group"
                  >
                    {/* Complaint Card Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-emerald-100">
                      <div className="flex items-start md:items-center gap-3.5">
                        <Avatar name={c.user?.name || "Anonymous Citizen"} size="h-11 w-11" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display font-bold text-lg text-slate-800 capitalize">
                              {c.classification?.predictedType || "Unclassified Incident"}
                            </h3>
                            {c.legalInfo?.urgency && (
                              <UrgencyBadge urgency={c.legalInfo.urgency} />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-mono mt-0.5">
                            <span className="text-slate-800">{c.user?.name || "Unknown"}</span> ·{" "}
                            <span>{c.user?.email || "No email on record"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                        <StatusBadge status={c.status} />
                        <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                          <Calendar className="h-3 w-3 text-emerald-700" />
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Complaint Content */}
                    <div className="mb-4">
                      <p className="text-sm text-emerald-950 leading-relaxed bg-emerald-50/90 p-4 rounded-xl border border-emerald-200 shadow-sm">
                        {c.englishText || c.originalText}
                      </p>
                    </div>

                    {/* Quick Extracted Chips */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {c.entities?.amounts?.map((amt, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <CreditCard className="h-3 w-3" />
                          Amount: {amt}
                        </span>
                      ))}
                      {c.entities?.upiIds?.map((upi, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-cyan/10 text-cyan border border-cyan/30">
                          <Hash className="h-3 w-3" />
                          UPI: {upi}
                        </span>
                      ))}
                      {c.entities?.phoneNumbers?.map((ph, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          <Phone className="h-3 w-3" />
                          {ph}
                        </span>
                      ))}
                      {c.legalInfo?.sections?.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          <Scale className="h-3 w-3" />
                          {c.legalInfo.sections[0]}
                          {c.legalInfo.sections.length > 1 && ` +${c.legalInfo.sections.length - 1} more`}
                        </span>
                      )}
                    </div>

                    {/* Officer Status Control & Note Form */}
                    <div className="bg-white/90 border border-emerald-100 rounded-xl p-3.5 mb-3 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 shadow-[0_16px_35px_-28px_rgba(16,70,42,0.35)]">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-slate-600 uppercase">Status:</span>
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateStatus(c._id, e.target.value)}
                          disabled={savingCaseId === c._id}
                          className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-slate-600 uppercase">Assign:</span>
                        <select
                          value={c.assignedOfficer?._id || ""}
                          onChange={(e) => handleAssignOfficer(c._id, e.target.value)}
                          className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[170px]"
                        >
                          <option value="">Unassigned</option>
                          {officerOptions.map((officer) => (
                            <option key={officer._id} value={officer._id}>
                              {officer.name} ({officer.role})
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Add official reviewer note for citizen…"
                        defaultValue={c.adminNote}
                        onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [c._id]: e.target.value }))}
                        className="flex-1 bg-emerald-50/60 border border-emerald-100 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />

                      <button
                        onClick={() => handleUpdateStatus(c._id, c.status)}
                        disabled={savingCaseId === c._id}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 text-emerald-950 font-semibold text-xs hover:brightness-105 disabled:opacity-50 transition shadow-[0_14px_28px_-18px_rgba(34,197,94,0.9)] shrink-0"
                      >
                        {savingCaseId === c._id ? "Saving…" : "Save Note"}
                      </button>
                    </div>

                    {(c.assignedOfficer || c.reviewedBy) && (
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] font-mono text-slate-600">
                        {c.assignedOfficer ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">
                            <UserCheck className="h-3 w-3" /> Assigned to {c.assignedOfficer.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-1">
                            <UserMinus className="h-3 w-3" /> Unassigned
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reviewer Footnote */}
                    {c.reviewedBy && (
                      <p className="text-[11px] font-mono text-slate-600 mb-2">
                        Last audited by <span className="text-slate-800">{c.reviewedBy.name}</span> ({c.reviewedBy.role})
                      </p>
                    )}

                    {/* Expand Details Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => setExpandedCaseId(isExpanded ? null : c._id)}
                        className="text-xs font-mono text-mist hover:text-signal flex items-center gap-1 transition"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" /> Less Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" /> Full Legal & Investigation Details
                          </>
                        )}
                      </button>

                      <div className="text-[11px] font-mono text-mist/60">
                        Case ID: {c._id}
                      </div>
                    </div>

                    {/* Expanded Investigation Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
                        {c.originalText !== c.englishText && (
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-mono text-mist">
                              Original Citizen Input
                            </span>
                            <p className="mt-1 text-xs text-white/70 bg-ink/50 p-3 rounded-lg border border-white/5">
                              {c.originalText}
                            </p>
                          </div>
                        )}

                        {c.legalInfo?.sections?.length > 0 && (
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-mono text-mist">
                              Suggested Legal Sections
                            </span>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                              {c.legalInfo.sections.map((sec, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                  {sec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {c.legalInfo?.evidence?.length > 0 && (
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-mono text-mist">
                              Recommended Evidence Checklist
                            </span>
                            <ul className="mt-1.5 space-y-1 text-xs text-white/80">
                              {c.legalInfo.evidence.map((ev, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                                  {ev}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {c.legalInfo?.guidance && (
                          <div className="bg-signal/5 border border-signal/20 rounded-xl p-3">
                            <span className="text-[11px] uppercase tracking-wider font-mono text-signal">
                              Immediate Platform & Citizen Guidance
                            </span>
                            <p className="mt-1 text-xs text-white/90">
                              {c.legalInfo.guidance}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Event Timeline */}
                    <div className="mt-3">
                      <EventTimeline caseId={c._id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OFFICERS & ACCESS CONTROL */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search users by name, email, or role…"
                className="w-full bg-ink/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/50 focus:outline-none focus:border-signal/50 focus:ring-2 focus:ring-signal/10 hover:border-white/20 transition-all duration-200"
              />
            </div>
            <div className="text-xs font-mono text-mist">
              Showing {filteredUsers.length} of {users.length} registered accounts
            </div>
          </div>

          {loadingUsers && (
            <div className="cyber-card rounded-2xl p-16 text-center">
              <div className="inline-block h-8 w-8 rounded-full border-2 border-signal border-t-transparent animate-spin mb-3" />
              <p className="text-mist font-mono text-sm">Loading security credentials…</p>
            </div>
          )}

          {!loadingUsers && userError && (
            <div className="cyber-card border border-alert/40 rounded-2xl p-6 text-center bg-alert/5">
              <AlertOctagon className="h-8 w-8 text-alert mx-auto mb-2" />
              <p className="text-alert font-semibold mb-1">Failed to Load Users</p>
              <p className="text-mist text-xs mb-4">{userError}</p>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 rounded-xl bg-alert/20 border border-alert/40 text-alert text-xs font-semibold hover:bg-alert/30 transition"
              >
                Retry Request
              </button>
            </div>
          )}

          {!loadingUsers && !userError && filteredUsers.length > 0 && (
            <div className="cyber-card rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
              {filteredUsers.map((u) => (
                <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/[0.02] transition">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar name={u.name} size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{u.name}</p>
                      <p className="text-xs text-mist font-mono truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <RoleBadge role={u.role} />

                    {u.role === "admin" ? (
                      <span className="text-[11px] font-mono text-purple-300/70 italic px-3 py-1">
                        System Admin
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={updatingUserId === u._id}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition disabled:opacity-50 ${
                          u.role === "officer"
                            ? "bg-alert/15 border border-alert/40 text-alert hover:bg-alert/25"
                            : "bg-signal text-ink hover:brightness-110 shadow-glow-signal"
                        }`}
                      >
                        {updatingUserId === u._id ? (
                          "Updating…"
                        ) : u.role === "officer" ? (
                          <>
                            <UserMinus className="h-3.5 w-3.5" /> Demote to Citizen
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3.5 w-3.5" /> Promote to Officer
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
