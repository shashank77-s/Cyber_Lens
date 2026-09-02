import express from "express";
import { classifyFraudType } from "../utils/huggingface.js";
import { extractEntities } from "../utils/entityExtractor.js";
import { getLegalInfo } from "../data/legalMapping.js";
import { reconstructTimeline } from "../utils/timelineReconstructor.js";
import { detectPlatformGuidance } from "../data/platformGuidance.js";
import { actionCriticalQuestions } from "../data/followUpQuestions.js";
import { computeUrgencyAdjustment } from "../utils/followUpEngine.js";

const router = express.Router();

/**
 * POST /api/refine
 * body: { englishText, classification, answers: { [questionId]: string } }
 * Re-runs classification on the original text + free-text answers, and
 * adds high-priority victim action steps based on the answers.
 */
router.post("/", async (req, res) => {
  try {
    const { englishText, classification: originalClassification, answers = {} } = req.body;

    if (!englishText) {
      return res.status(400).json({ error: "Missing the original incident text." });
    }

    const critical = actionCriticalQuestions[originalClassification.predictedType] || [];
    const freeTextAnswerLines = Object.entries(answers)
      .filter(([id, val]) => {
        const isYesNo = critical.some((q) => q.id === id && q.type === "yesno");
        return !isYesNo && val && String(val).trim().length > 0;
      })
      .map(([, val]) => val);

    const combinedText = freeTextAnswerLines.length > 0
      ? `${englishText} ${freeTextAnswerLines.join(". ")}`
      : englishText;

    const classification = await classifyFraudType(combinedText);
    const entities = extractEntities(combinedText);
    let legalInfo = { ...getLegalInfo(classification.predictedType) };
    const timeline = reconstructTimeline(combinedText);
    const platformGuidance = detectPlatformGuidance(combinedText);

    const { escalate, urgentActions } = computeUrgencyAdjustment(originalClassification, answers);
    if (escalate && urgentActions && urgentActions.length > 0) {
      const dynamicSteps = urgentActions.map((act) => ({
        priority: "CRITICAL",
        action: "Immediate Mitigation",
        detail: act,
      }));

      legalInfo.urgency = "high";
      legalInfo.actionSteps = [...dynamicSteps, ...(legalInfo.actionSteps || [])];
      legalInfo.guidance = `🚨 URGENT ACTION: ${urgentActions.join(" ")} ${legalInfo.guidance}`;
    }

    res.json({
      originalText: combinedText,
      englishText: combinedText,
      classification,
      entities,
      legalInfo,
      timeline,
      platformGuidance,
      refined: true,
    });
  } catch (err) {
    console.error("Refine error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong refining your case. Please try again." });
  }
});

export default router;
