import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import api from "./api/axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CyberShieldLogo, RoleBadge } from "./components/UIKit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyCases from "./pages/MyCases";
import CaseReviewDashboard from "./pages/CaseReviewDashboard";
import ManageOfficers from "./pages/ManageOfficers";
import AdminPanel from "./pages/AdminPanel";
import LanguageSelector from "./components/LanguageSelector";
import VoiceInput from "./components/VoiceInput";
import DraftPreview from "./components/DraftPreview";
import FollowUpPanel from "./components/FollowUpPanel";
import {
  ShieldAlert,
  FileText,
  Users,
  LogOut,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  Shield,
  HelpCircle
} from "lucide-react";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/80 border-b border-white/10 px-4 md:px-10 py-3.5 flex items-center justify-between transition-all">
      <Link to="/" className="flex items-center group">
        <CyberShieldLogo size="sm" />
      </Link>

      <nav className="flex items-center gap-2 md:gap-4 text-xs font-mono">
        {user ? (
          <>
            {user.role === "user" && (
              <Link
                to="/my-cases"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isActive("/my-cases")
                    ? "bg-signal/15 text-signal border border-signal/30 font-semibold"
                    : "text-mist hover:text-white"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">My Complaints</span>
              </Link>
            )}

            {user.role === "admin" && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isActive("/admin")
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold shadow-glow-signal"
                    : "text-mist hover:text-purple-300"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                <span>Admin Panel</span>
              </Link>
            )}

            {(user.role === "officer" || user.role === "admin") && (
              <Link
                to="/review"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isActive("/review")
                    ? "bg-cyan/15 text-cyan border border-cyan/30 font-semibold"
                    : "text-mist hover:text-white"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Review Complaints</span>
              </Link>
            )}

            {user.role === "admin" && (
              <Link
                to="/admin/officers"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition hidden lg:flex ${
                  isActive("/admin/officers")
                    ? "bg-signal/15 text-signal border border-signal/30 font-semibold"
                    : "text-mist hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Manage Officers</span>
              </Link>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <span className="text-white/90 text-xs hidden md:inline font-sans font-medium">
                {user.name}
              </span>
              <RoleBadge role={user.role} />
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              title="Log out"
              className="p-1.5 rounded-lg border border-white/10 text-mist hover:border-alert/40 hover:text-alert hover:bg-alert/10 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-mist hover:text-signal transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-xl bg-signal text-ink font-bold hover:brightness-110 shadow-glow-signal transition"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

function IntakePage() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [langCode, setLangCode] = useState("eng_Latn");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [answeredFollowUp, setAnsweredFollowUp] = useState(false);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setSaved(false);
    setAnsweredFollowUp(false);
    if (text.trim().length < 10) {
      setError("Please provide more details regarding the incident (at least 20-30 words recommended).");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/analyze", { text, srcLang: langCode });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis service unavailable. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefined = (refinedResult) => {
    setResult((prev) => ({ ...prev, ...refinedResult, followUpQuestions: [] }));
    setAnsweredFollowUp(true);
    setSaved(false);
  };

  const handleSaveCase = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await api.post("/cases", {
        originalText: result.originalText,
        englishText: result.englishText,
        classification: result.classification,
        entities: result.entities,
        legalInfo: result.legalInfo,
        followUpAnswered: answeredFollowUp,
      });
      setSaved(true);
    } catch {
      setError("Couldn't save this case to database. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await api.post(
        "/draft/pdf",
        {
          englishText: result.englishText,
          classification: result.classification,
          entities: result.entities,
          legalInfo: result.legalInfo,
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cybercrime_complaint_draft.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Failed to compile the PDF document. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-14 animate-fade-in">
      {/* Hero Header */}
      <section className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 text-signal text-xs font-mono mb-4">
          <Shield className="h-3.5 w-3.5" />
          <span>AI-Assisted Cybercrime Incident Portal</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Report cybercrime incidents.
          <br />
          <span className="bg-gradient-to-r from-signal via-cyan to-emerald-400 bg-clip-text text-transparent">
            We'll structure the legal complaint.
          </span>
        </h1>
        <p className="mt-3 text-mist text-sm md:text-base max-w-2xl leading-relaxed">
          Describe what happened in plain English, Hindi, or Kannada. Our intelligence engine extracts financial artifacts, maps relevant IT Act provisions, and compiles an official police complaint draft.
        </p>
      </section>

      {/* Incident Input Panel */}
      <section className="cyber-card rounded-2xl p-5 md:p-7 space-y-4 shadow-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-white/5">
          <LanguageSelector value={langCode} onChange={setLangCode} />
          <VoiceInput
            langCode={langCode}
            onResult={(t) => setText((prev) => (prev ? prev + " " + t : t))}
          />
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="Describe the incident: e.g. I received a phone call claiming to be Paytm customer care asking me to install AnyDesk. Shortly after, ₹45,000 was debited via UPI to merchant ref 82736192 on 15/08/2026..."
            className="w-full bg-ink/80 border border-white/10 rounded-xl p-4 text-sm text-slate-100 placeholder:text-mist/40 focus:outline-none focus:ring-2 focus:ring-signal/40 focus:border-signal/40 transition resize-none leading-relaxed font-sans"
          />
          <div className="flex justify-between items-center text-[11px] font-mono text-mist/60 px-1 mt-1">
            <span>Minimum 10 characters</span>
            <span>{text.length} characters</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-alert/10 border border-alert/30 text-alert text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-alert shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || text.trim().length === 0}
          className="w-full py-3.5 rounded-xl bg-signal text-ink font-bold text-sm hover:brightness-110 shadow-glow-signal transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
              Analyzing & Extracting Cyber Forensic Entities…
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Incident & Generate Legal Draft
            </>
          )}
        </button>
      </section>

      {/* Analysis Result Section */}
      {result && (
        <section className="mt-8 space-y-6">
          {!answeredFollowUp &&
            result.followUpQuestions &&
            result.followUpQuestions.length > 0 && (
              <FollowUpPanel result={result} onRefined={handleRefined} />
            )}

          <DraftPreview
            result={result}
            onDownload={handleDownload}
            downloading={downloading}
          />

          {user ? (
            <button
              onClick={handleSaveCase}
              disabled={saving || saved}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                saved
                  ? "bg-signal/20 border border-signal/50 text-signal"
                  : "border border-signal/40 text-signal hover:bg-signal/10"
              } disabled:opacity-50`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Successfully Filed to Your Account
                </>
              ) : saving ? (
                "Saving Case to Registry…"
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  Save Report to Track Investigation Status
                </>
              )}
            </button>
          ) : (
            <div className="cyber-card p-4 rounded-xl text-center text-xs text-mist">
              <Link to="/login" className="text-signal hover:underline font-semibold">
                Log in
              </Link>{" "}
              or{" "}
              <Link to="/register" className="text-signal hover:underline font-semibold">
                Register
              </Link>{" "}
              to save this case and monitor investigation updates.
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <IntakePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/my-cases"
        element={
          <ProtectedRoute>
            <MyCases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedRoute requireRole={["officer", "admin"]}>
            <CaseReviewDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/officers"
        element={
          <ProtectedRoute requireRole="admin">
            <ManageOfficers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <NavBar />
            <div className="flex-1">
              <AppRoutes />
            </div>
            <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-mist/60 space-y-1">
              <p>CyberShield AI · Academic Cyber Forensics & Legal Drafting System</p>
              <p className="text-[11px] text-mist/40">Not legal counsel · Verify with cyber law experts or on cybercrime.gov.in</p>
            </footer>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
