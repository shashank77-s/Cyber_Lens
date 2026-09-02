import mongoose from "mongoose";

/**
 * Tracks what happened to a case over time — a simple audit trail.
 * Every meaningful action (created, status changed, follow-up answered)
 * writes one of these, so both the citizen and any reviewer can see a
 * clear history instead of just the current state.
 */
const eventSchema = new mongoose.Schema(
  {
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["case_created", "followup_answered", "status_updated", "note_added"],
      required: true,
    },
    message: { type: String, required: true }, // human-readable summary, e.g. "Status changed from Filed to Under Review"
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
