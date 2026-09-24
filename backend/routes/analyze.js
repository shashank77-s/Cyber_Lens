import express from "express";
import { classifyFraudType, translateToEnglish } from "../utils/huggingface.js";
import { extractEntities } from "../utils/entityExtractor.js";
import { getLegalInfo, computeUrgency } from "../data/legalMapping.js";
import { reconstructTimeline } from "../utils/timelineReconstructor.js";
import { detectPlatformGuidance } from "../data/platformGuidance.js";
import { generateFollowUpQuestions } from "../utils/followUpEngine.js";

const router = express.Router();

/**
 * POST /api/analyze
 * body: { text: string, srcLang?: string }
 * Pipeline: translate -> classify -> extract entities -> legal mapping
 *           -> timeline -> platform guidance -> follow-up questions
 */
router.post("/", async (req, res) => {
  try {
    const { text, srcLang = "eng_Latn" } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "Please provide a more detailed description (at least a sentence or two)." });
    }

    const englishText = await translateToEnglish(text, srcLang);
    const classification = await classifyFraudType(englishText);
    const entities = extractEntities(englishText);
    const legalInfo = getLegalInfo(classification.predictedType);
    legalInfo.urgency = computeUrgency(classification.predictedType, entities, englishText);
    const timeline = reconstructTimeline(englishText);
    const platformGuidance = detectPlatformGuidance(englishText);
    const followUp = generateFollowUpQuestions(classification, entities);

    res.json({
      originalText: text,
      englishText,
      classification,
      entities,
      legalInfo,
      timeline,
      platformGuidance,
      followUpQuestions: followUp.questions,
      needsMoreInfo: followUp.needsMoreInfo,
    });
  } catch (err) {
    console.error("Analyze error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Something went wrong analyzing your incident. If this keeps happening, the HuggingFace model may still be loading — try again in ~20 seconds.",
    });
  }
});

export default router;
