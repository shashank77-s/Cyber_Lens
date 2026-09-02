import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CyberShieldLogo } from "../components/UIKit";
import { User, Mail, Lock, KeyRound, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(name, email, password, adminSecret ? adminSecret.trim() : undefined);
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "officer") {
        navigate("/review");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center text-slate-100 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <CyberShieldLogo size="default" className="justify-center mb-3" />
          <h2 className="font-display text-2xl font-bold text-white">
            Create Security Credentials
          </h2>
          <p className="text-xs text-mist font-mono mt-1">
            Register to report incidents and track legal classification
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="cyber-card rounded-2xl p-6 md:p-8 space-y-4 shadow-2xl border border-white/10"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-alert/10 border border-alert/30 text-alert text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mist mb-1.5">
              Full Legal Name / Alias
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ink/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/40 focus:outline-none focus:ring-2 focus:ring-signal/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mist mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/40 focus:outline-none focus:ring-2 focus:ring-signal/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-mist mb-1.5">
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-mist/40 focus:outline-none focus:ring-2 focus:ring-signal/40"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Admin Secret Key Toggle */}
          <div className="pt-1">
            {showAdminField ? (
              <div className="space-y-1.5 p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Admin Secret Authorization Key
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowAdminField(false); setAdminSecret(""); }}
                    className="text-[10px] text-mist hover:text-white underline"
                  >
                    Cancel
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300/70" />
                  <input
                    type="password"
                    placeholder="Enter server ADMIN_SECRET_KEY"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    className="w-full bg-ink/90 border border-purple-500/40 rounded-lg pl-10 pr-3 py-2 text-xs text-white placeholder:text-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <p className="text-[10px] text-mist/70">
                  Required only for Root Administrators. Leave empty if you are a normal citizen.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminField(true)}
                className="text-xs font-mono text-mist hover:text-signal flex items-center gap-1.5 transition"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Registering as an administrator?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-signal text-ink font-semibold text-sm hover:brightness-110 shadow-glow-signal transition disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                Registering…
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-xs text-mist text-center pt-2">
            Already registered?{" "}
            <Link to="/login" className="text-signal hover:underline font-semibold">
              Log in to account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
