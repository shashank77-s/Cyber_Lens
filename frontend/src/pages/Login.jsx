import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, AlertCircle, Shield, Zap } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "officer") {
        navigate("/review");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials. Please verify your email and password.");
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
            Welcome Back
          </h2>
          <p className="text-sm text-mist">
            Authenticate to access your security portal
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="auth-field">
              <label className="auth-label">Account Email</label>
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

            {/* Password field */}
            <div className="auth-field">
              <div className="flex items-center justify-between mb-2">
                <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                <span className="text-[11px] font-mono text-mist/60 hover:text-signal cursor-pointer transition-colors duration-200">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="auth-input-icon h-4 w-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn mt-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                  Authenticating…
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Log In to Portal
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">or</div>

          {/* Sign up link */}
          <p className="text-sm text-mist text-center">
            New here?{" "}
            <Link
              to="/register"
              className="text-signal font-semibold hover:text-white transition-colors duration-200 underline underline-offset-2"
            >
              Create an account
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
