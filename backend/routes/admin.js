import express from "express";
import User from "../models/User.js";
import Case from "../models/Case.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error("Fetch users error:", err.message);
    res.status(500).json({ error: "Couldn't load users list." });
  }
});

/**
 * GET /api/admin/stats
 * Aggregate dashboard statistics for admin panel
 */
router.get("/stats", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const [totalCases, totalUsers, filedCount, underReviewCount, resolvedCount, rejectedCount, highUrgencyCount] = await Promise.all([
      Case.countDocuments(),
      User.countDocuments(),
      Case.countDocuments({ status: "Filed" }),
      Case.countDocuments({ status: "Under Review" }),
      Case.countDocuments({ status: "Resolved" }),
      Case.countDocuments({ status: "Rejected" }),
      Case.countDocuments({ "legalInfo.urgency": "high" }),
    ]);

    const officerCount = await User.countDocuments({ role: "officer" });
    const adminCount = await User.countDocuments({ role: "admin" });
    const regularUserCount = await User.countDocuments({ role: "user" });

    res.json({
      stats: {
        totalCases,
        filed: filedCount,
        underReview: underReviewCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
        highUrgency: highUrgencyCount,
        totalUsers,
        officers: officerCount,
        admins: adminCount,
        citizens: regularUserCount,
      },
    });
  } catch (err) {
    console.error("Fetch admin stats error:", err.message);
    res.status(500).json({ error: "Couldn't load admin statistics." });
  }
});

/**
 * GET /api/admin/cases
 * Direct route for admin complaints listing
 */
router.get("/cases", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("user", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });
    res.json({ cases: cases || [] });
  } catch (err) {
    console.error("Fetch admin cases error:", err.message);
    res.status(500).json({ error: "Couldn't load complaints list." });
  }
});

/**
 * Only toggles between "officer" and "user" — creating an "admin" is
 * never exposed through the API, only via a direct database edit.
 */
router.patch("/users/:id/role", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["officer", "user"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'officer' or 'user'." });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: "User not found." });
    if (target.role === "admin") {
      return res.status(403).json({ error: "Admin roles can't be changed through this panel." });
    }

    target.role = role;
    await target.save();
    res.json({ user: { id: target._id, name: target.name, email: target.email, role: target.role } });
  } catch (err) {
    console.error("Role update error:", err.message);
    res.status(500).json({ error: "Couldn't update this user's role." });
  }
});

export default router;
