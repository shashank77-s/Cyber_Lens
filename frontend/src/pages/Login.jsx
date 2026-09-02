import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CyberShieldLogo } from "../components/UIKit";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

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
    <div className="min-h-[85vh] flex items-center justify-center text-slate-100 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <CyberShieldLogo size="default" className="justify-center mb-3" />
          <h2 className="font-display text-2xl font-bold text-white">
            Security Access Terminal
          </h2>
          <p className="text-xs text-mist font-mono mt-1">
            Authenticate to manage or review cyber incident reports
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
              Account Email
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
              Password
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-signal text-ink font-semibold text-sm hover:brightness-110 shadow-glow-signal transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                Authenticating…
              </span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Log In
              </>
            )}
          </button>

          <p className="text-xs text-mist text-center pt-2">
            New citizen or investigator?{" "}
            <Link to="/register" className="text-signal hover:underline font-semibold">
              Register an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
