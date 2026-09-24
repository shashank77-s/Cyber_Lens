import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Avatar, RoleBadge, StatCard } from "../components/UIKit";
import { Users, ShieldCheck, ShieldAlert, Search, UserCheck, UserMinus, ArrowLeft } from "lucide-react";

export default function ManageOfficers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    setError("");
    api.get("/admin/users")
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => {
        const msg = err.response?.data?.error || "Couldn't load users.";
        setError(msg);
        showToast(msg, "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const stats = useMemo(() => ({
    total: users.length,
    officers: users.filter((u) => u.role === "officer").length,
    admins: users.filter((u) => u.role === "admin").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, search]);

  const toggleRole = async (user) => {
    if (user.role === "admin") return;
    const newRole = user.role === "officer" ? "user" : "officer";
    setUpdatingId(user._id);
    try {
      const res = await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: res.data.user.role } : u)));
      showToast(newRole === "officer" ? `${user.name} promoted to Officer` : `${user.name} reverted to Citizen`);
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't update this user's role.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 max-w-5xl mx-auto px-4 md:px-8 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-signal">
              Identity & Access Management
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Manage Officers
          </h1>
          <p className="text-mist text-sm mt-1">
            Grant or revoke Cyber Officer permissions to review and update incoming citizen complaints.
          </p>
        </div>

        <Link
          to="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-xl cyber-card border border-white/10 text-xs font-mono text-mist-light hover:text-signal hover:border-signal/40 hover:-translate-y-0.5 transition-all duration-200 self-start md:self-auto"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Full Admin Panel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.total} accent="mist" icon={Users} />
        <StatCard label="Active Officers" value={stats.officers} accent="cyan" icon={ShieldCheck} />
        <StatCard label="Administrators" value={stats.admins} accent="signal" icon={ShieldAlert} />
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-ink/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/50 focus:outline-none focus:border-signal/50 focus:ring-2 focus:ring-signal/10 hover:border-white/20 transition-all duration-200"
        />
      </div>

      {loading && (
        <div className="cyber-card rounded-2xl p-16 text-center">
          <div className="inline-block h-8 w-8 rounded-full border-2 border-signal border-t-transparent animate-spin mb-3" />
          <p className="text-mist font-mono text-sm">Loading user roster…</p>
        </div>
      )}

      {!loading && error && (
        <div className="cyber-card border border-alert/40 rounded-2xl p-6 text-center bg-alert/5">
          <p className="text-alert font-semibold mb-2">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 rounded-xl bg-alert/20 border border-alert/40 text-alert text-xs font-semibold hover:bg-alert/30 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="cyber-card rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
          {filteredUsers.map((u) => (
            <div key={u._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/[0.04] transition-all duration-200 group border-l-2 border-l-transparent hover:border-l-signal/40">
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
                    onClick={() => toggleRole(u)}
                    disabled={updatingId === u._id}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition disabled:opacity-50 ${
                      u.role === "officer"
                        ? "bg-alert/15 border border-alert/40 text-alert hover:bg-alert/25"
                        : "bg-signal text-ink hover:brightness-110 shadow-glow-signal"
                    }`}
                  >
                    {updatingId === u._id ? (
                      "…"
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
  );
}
