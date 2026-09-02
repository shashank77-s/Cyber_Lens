import express from "express";
import Case from "../models/Case.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { logEvent } from "../utils/eventLogger.js";

const router = express.Router();

/**
 * POST /api/cases
 * Saves an analyzed complaint with optional evidence photos.
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { originalText, englishText, classification, entities, legalInfo, followUpAnswered, evidencePhotos } = req.body;
    const newCase = await Case.create({
      user: req.user.id,
      originalText,
      englishText,
      classification,
      entities,
      legalInfo,
      evidencePhotos: Array.isArray(evidencePhotos) ? evidencePhotos : [],
    });

    await logEvent(newCase._id, req.user.id, "case_created", "Complaint filed and saved to account.");
    if (evidencePhotos && evidencePhotos.length > 0) {
      await logEvent(newCase._id, req.user.id, "evidence_uploaded", `${evidencePhotos.length} evidence photo(s) attached by complainant.`);
    }
    if (followUpAnswered) {
      await logEvent(newCase._id, req.user.id, "followup_answered", "Follow-up questions were answered before saving, refining the classification.");
    }

    res.status(201).json({ case: newCase });
  } catch (err) {
    console.error("Save case error:", err.message);
    res.status(500).json({ error: "Couldn't save this case." });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user.id })
      .populate("assignedOfficer", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json({ cases });
  } catch (err) {
    console.error("Fetch my cases error:", err.message);
    res.status(500).json({ error: "Failed to load your complaints." });
  }
});

// Officers AND admins can both review every complaint
router.get("/", requireAuth, requireRole("officer", "admin"), async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("user", "name email role")
      .populate("reviewedBy", "name email role")
      .populate("assignedOfficer", "name email role")
      .sort({ createdAt: -1 });
    res.json({ cases: cases || [] });
  } catch (err) {
    console.error("Fetch all cases error:", err.message);
    res.status(500).json({ error: "Failed to load complaints." });
  }
});

/**
 * GET /api/cases/:id/events
 * Returns the event/activity timeline for one case — the case owner,
 * or any officer/admin, can view it.
 */
router.get("/:id/events", requireAuth, async (req, res) => {
  try {
    const targetCase = await Case.findById(req.params.id);
    if (!targetCase) return res.status(404).json({ error: "Case not found." });

    const isOwner = targetCase.user.toString() === req.user.id;
    const isReviewer = req.user.role === "officer" || req.user.role === "admin";
    if (!isOwner && !isReviewer) {
      return res.status(403).json({ error: "You don't have permission to view this case's activity." });
    }

    const events = await Event.find({ case: req.params.id }).populate("actor", "name role").sort({ createdAt: 1 });
    res.json({ events });
  } catch (err) {
    console.error("Fetch events error:", err.message);
    res.status(500).json({ error: "Couldn't load activity for this case." });
  }
});

router.patch("/:id/status", requireAuth, requireRole("officer", "admin"), async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ["Filed", "Under Review", "Resolved", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}` });
    }

    const before = await Case.findById(req.params.id);
    if (!before) return res.status(404).json({ error: "Case not found." });
    const previousStatus = before.status;
    const previousNote = before.adminNote;

    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNote !== undefined ? { adminNote } : {}), reviewedBy: req.user.id },
      { new: true }
    )
      .populate("user", "name email role")
      .populate("reviewedBy", "name email role")
      .populate("assignedOfficer", "name email role");

    if (previousStatus !== status) {
      await logEvent(updated._id, req.user.id, "status_updated", `Status changed from "${previousStatus}" to "${status}".`);
    }
    if (adminNote !== undefined && adminNote !== previousNote && adminNote.trim().length > 0) {
      await logEvent(updated._id, req.user.id, "note_added", `Note added: "${adminNote}"`);
    }

    res.json({ case: updated });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ error: "Couldn't update case status." });
  }
});

/**
 * PATCH /api/cases/:id/assign
 * Admin can assign or reassign a complaint to a specific officer, or unassign (officerId: null).
 */
router.patch("/:id/assign", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { officerId } = req.body;
    const targetCase = await Case.findById(req.params.id);
    if (!targetCase) return res.status(404).json({ error: "Case not found." });

    let assignedUser = null;
    if (officerId) {
      assignedUser = await User.findById(officerId);
      if (!assignedUser || (assignedUser.role !== "officer" && assignedUser.role !== "admin")) {
        return res.status(400).json({ error: "Assigned user must be an active officer or administrator." });
      }
    }

    targetCase.assignedOfficer = officerId || null;
    await targetCase.save();

    const updated = await Case.findById(req.params.id)
      .populate("user", "name email role")
      .populate("reviewedBy", "name email role")
      .populate("assignedOfficer", "name email role");

    const logMsg = assignedUser
      ? `Complaint assigned to officer: ${assignedUser.name} (${assignedUser.email})`
      : "Complaint assignment cleared (set to Unassigned).";
    await logEvent(updated._id, req.user.id, "officer_assigned", logMsg);

    res.json({ case: updated });
  } catch (err) {
    console.error("Assign officer error:", err.message);
    res.status(500).json({ error: "Failed to update case assignment." });
  }
});

export default router;
