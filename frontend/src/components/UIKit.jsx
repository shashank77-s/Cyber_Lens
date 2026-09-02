import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText,
  AlertTriangle
} from "lucide-react";

export function CyberShieldLogo({ size = "default", className = "" }) {
  const isSmall = size === "sm";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-signal/25 blur-md rounded-xl" />
        <div className={`relative ${isSmall ? "h-8 w-8" : "h-10 w-10"} rounded-xl bg-gradient-to-br from-panel-card to-ink border border-signal/40 flex items-center justify-center shadow-glow-signal`}>
          <Shield className={`${isSmall ? "h-4 w-4" : "h-5 w-5"} text-signal`} />
          <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-signal animate-ping" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-display ${isSmall ? "text-base" : "text-lg"} font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-signal bg-clip-text text-transparent`}>
            CyberShield
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-signal/15 text-signal border border-signal/30 tracking-widest">
            AI
          </span>
        </div>
        {!isSmall && (
          <p className="text-[10px] tracking-wider text-mist uppercase font-mono">Incident Intelligence</p>
        )}
      </div>
    </div>
  );
}

const ROLE_CONFIG = {
  admin: {
    bg: "bg-purple-500/15 border-purple-500/40 text-purple-300",
    dot: "bg-purple-400",
    label: "Administrator",
    icon: ShieldAlert,
  },
  officer: {
    bg: "bg-cyan/15 border-cyan/40 text-cyan",
    dot: "bg-cyan",
    label: "Cyber Officer",
    icon: ShieldCheck,
  },
  user: {
    bg: "bg-white/10 border-white/15 text-mist-light",
    dot: "bg-mist",
    label: "Citizen",
    icon: User,
  },
};

export function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border backdrop-blur-sm ${config.bg}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

const AVATAR_PALETTES = [
  "from-signal/20 to-cyan/20 text-signal border-signal/40",
  "from-cyan/20 to-blue-500/20 text-cyan border-cyan/40",
  "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40",
  "from-amber-400/20 to-orange-500/20 text-amber-300 border-amber-400/40",
];

export function Avatar({ name, size = "h-9 w-9" }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const index = (name?.charCodeAt(0) || 0) % AVATAR_PALETTES.length;

  return (
    <div className={`${size} rounded-xl bg-gradient-to-br ${AVATAR_PALETTES[index]} border flex items-center justify-center font-display font-semibold text-xs shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

const STAT_THEMES = {
  signal: {
    text: "text-signal",
    border: "hover:border-signal/50",
    glow: "group-hover:bg-signal/10",
    iconBg: "bg-signal/10 text-signal border-signal/30",
  },
  cyan: {
    text: "text-cyan",
    border: "hover:border-cyan/50",
    glow: "group-hover:bg-cyan/10",
    iconBg: "bg-cyan/10 text-cyan border-cyan/30",
  },
  blue: {
    text: "text-blue-400",
    border: "hover:border-blue-400/50",
    glow: "group-hover:bg-blue-400/10",
    iconBg: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  },
  alert: {
    text: "text-alert",
    border: "hover:border-alert/50",
    glow: "group-hover:bg-alert/10",
    iconBg: "bg-alert/10 text-alert border-alert/30",
  },
  amber: {
    text: "text-amber-400",
    border: "hover:border-amber-400/50",
    glow: "group-hover:bg-amber-400/10",
    iconBg: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  mist: {
    text: "text-mist-light",
    border: "hover:border-white/20",
    glow: "group-hover:bg-white/5",
    iconBg: "bg-white/5 text-mist border-white/10",
  },
};

export function StatCard({ label, value, accent = "signal", icon: Icon, subtitle }) {
  const theme = STAT_THEMES[accent] || STAT_THEMES.signal;

  return (
    <div className={`group relative cyber-card rounded-2xl p-5 flex-1 min-w-[170px] border border-white/10 transition-all duration-300 ${theme.border} overflow-hidden`}>
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl transition-all duration-500 ${theme.glow}`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-mono text-mist mb-1.5">{label}</p>
          <p className={`text-3xl font-display font-bold tracking-tight ${theme.text}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-mist/70 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${theme.iconBg} shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  "Filed": {
    bg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    dot: "bg-blue-400",
    icon: Clock,
  },
  "Under Review": {
    bg: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    dot: "bg-amber-400 animate-pulse",
    icon: AlertTriangle,
  },
  "Resolved": {
    bg: "bg-signal/15 text-signal border-signal/40 shadow-glow-signal",
    dot: "bg-signal",
    icon: CheckCircle2,
  },
  "Rejected": {
    bg: "bg-alert/15 text-alert border-alert/35",
    dot: "bg-alert",
    icon: XCircle,
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Filed"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <Icon className="h-3 w-3 shrink-0" />
      {status}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const styles = {
    high: "bg-alert/15 text-alert border-alert/40",
    medium: "bg-amber-400/15 text-amber-300 border-amber-400/40",
    low: "bg-signal/15 text-signal border-signal/40",
  };

  const labels = {
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };

  const level = urgency?.toLowerCase() || "medium";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider border ${styles[level] || styles.medium}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${level === "high" ? "bg-alert animate-ping" : level === "medium" ? "bg-amber-400" : "bg-signal"}`} />
      {labels[level] || "Priority"}
    </span>
  );
}
