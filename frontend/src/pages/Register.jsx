import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, KeyRound, ShieldAlert, ArrowRight, AlertCircle, Shield, Zap } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">

      {/* ── Animated Background ── */}
      <div className="auth-bg" />
      <div className="auth-grid" />
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="logo-ring">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-panel-card to-ink border border-signal/40 flex items-center justify-center shadow-glow-signal relative">
                <div className="absolute inset-0 bg-signal/20 blur-lg rounded-2xl" />
                <Shield className="h-8 w-8 text-signal relative z-10" />
                <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-signal animate-ping" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-900 via-emerald-700 to-green-500 bg-clip-text text-transparent">
              CyberShield
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 tracking-widest">
              AI
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-800 mb-1">
            Create Account
          </h2>
          <p className="text-sm text-mist">
            Register to report incidents and track legal classification
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card rounded-3xl p-8 space-y-5">

          {/* Error */}
          {error && (
            <div className="auth-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label">Full Name / Alias</label>
              <div className="relative">
                <User className="auth-input-icon h-4 w-4" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="relative">
                <Mail className="auth-input-icon h-4 w-4" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="auth-input-icon h-4 w-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Admin Secret Toggle */}
            <div>
              {showAdminField ? (
                <div className="admin-toggle-card space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Admin Authorization Key
                    </label>
                    <button
                      type="button"
                      onClick={() => { setShowAdminField(false); setAdminSecret(""); }}
                      className="text-[10px] text-mist hover:text-white underline transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="auth-field">
                    <div className="relative">
                      <KeyRound className="auth-input-icon h-4 w-4 text-purple-300/70" />
                      <input
                        type="password"
                        placeholder="Enter server ADMIN_SECRET_KEY"
                        value={adminSecret}
                        onChange={(e) => setAdminSecret(e.target.value)}
                        className="auth-input"
                        style={{ borderColor: "rgba(120, 60, 220, 0.35)" }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-mist/60">
                    Required only for Root Administrators. Leave empty if you are a normal citizen.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdminField(true)}
                  className="text-xs font-mono text-mist/70 hover:text-signal flex items-center gap-1.5 transition-all duration-200 group"
                >
                  <KeyRound className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
                  Registering as an administrator?
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn mt-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                  Creating Account…
                </span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">or</div>

          {/* Login link */}
          <p className="text-sm text-mist text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-signal font-semibold hover:text-white transition-colors duration-200 underline underline-offset-2"
            >
              Log in here
            </Link>
          </p>
        </div>

        {/* Bottom badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-mist/50">
          <Zap className="h-3 w-3 text-signal/60" />
          <span>Secured by CyberShield AI · Incident Intelligence</span>
        </div>
      </div>
    </div>
  );
}
