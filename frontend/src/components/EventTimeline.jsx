import { useState } from "react";
import api from "../api/axios";
import { 
  Activity, 
  FilePlus, 
  HelpCircle, 
  GitCommit, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Clock 
} from "lucide-react";

const EVENT_CONFIG = {
  case_created: {
    icon: FilePlus,
    color: "text-signal border-signal/40 bg-signal/10",
    dot: "bg-signal",
  },
  followup_answered: {
    icon: HelpCircle,
    color: "text-cyan border-cyan/40 bg-cyan/10",
    dot: "bg-cyan",
  },
  status_updated: {
    icon: GitCommit,
    color: "text-amber-400 border-amber-400/40 bg-amber-400/10",
    dot: "bg-amber-400",
  },
  note_added: {
    icon: Edit3,
    color: "text-purple-300 border-purple-400/40 bg-purple-400/10",
    dot: "bg-purple-400",
  },
};

export default function EventTimeline({ caseId }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && events === null) {
      setLoading(true);
      try {
        const res = await api.get(`/cases/${caseId}/events`);
        setEvents(res.data.events || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="mt-2">
      <button
        onClick={toggle}
        className="text-xs font-mono text-mist hover:text-signal flex items-center gap-1.5 transition py-1"
      >
        <Activity className="h-3.5 w-3.5" />
        <span>{open ? "Hide Activity Log" : "View Audit Timeline"}</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {open && (
        <div className="mt-2.5 pl-3 border-l border-white/10 space-y-3 animate-fade-in">
          {loading && (
            <div className="flex items-center gap-2 text-xs font-mono text-mist py-1">
              <span className="h-3 w-3 rounded-full border-2 border-signal border-t-transparent animate-spin" />
              Fetching audit records…
            </div>
          )}

          {!loading && events?.length === 0 && (
            <p className="text-xs font-mono text-mist/60 italic py-1">
              No previous audit activity logged for this complaint.
            </p>
          )}

          {!loading &&
            events?.map((ev) => {
              const config = EVENT_CONFIG[ev.type] || EVENT_CONFIG.case_created;
              const Icon = config.icon;
              return (
                <div key={ev._id} className="relative flex items-start gap-2.5 text-xs">
                  <div className={`p-1 rounded-md border shrink-0 mt-0.5 ${config.color}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 font-medium">{ev.message}</p>
                    <p className="text-mist/70 font-mono text-[10px] mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{ev.actor?.name || "System"}</span>
                      {ev.actor?.role && (
                        <span className="text-mist/50">({ev.actor.role})</span>
                      )}
                      <span>·</span>
                      <span>{new Date(ev.createdAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
