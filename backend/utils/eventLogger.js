import Event from "../models/Event.js";

/**
 * Logs one audit event for a case. Never throws — a failed log shouldn't
 * break the actual request (e.g. saving a case should still succeed even
 * if, for some reason, the event write fails).
 */
export async function logEvent(caseId, actorId, type, message) {
  try {
    await Event.create({ case: caseId, actor: actorId, type, message });
  } catch (err) {
    console.error("Event log error:", err.message);
  }
}
