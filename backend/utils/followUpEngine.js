import { actionCriticalQuestions, genericClarifyingQuestions } from "../data/followUpQuestions.js";

const LOW_CONFIDENCE_THRESHOLD = 0.55;

export function generateFollowUpQuestions(classification, entities) {
  const questions = [];

  const critical = actionCriticalQuestions[classification.predictedType] || actionCriticalQuestions["other cybercrime"];
  questions.push(...critical);

  const isLowConfidence = classification.confidence < LOW_CONFIDENCE_THRESHOLD;
  if (isLowConfidence) {
    questions.push(genericClarifyingQuestions.lowConfidence);
  }

  if (!entities.dates || entities.dates.length === 0) {
    questions.push(genericClarifyingQuestions.missingDate);
  }
  const isFinancialFraud = ["UPI payment fraud", "peer to peer cryptocurrency fraud", "fake loan app harassment"].includes(
    classification.predictedType
  );
  if (isFinancialFraud && (!entities.amounts || entities.amounts.length === 0)) {
    questions.push(genericClarifyingQuestions.missingAmount);
  }

  return { needsMoreInfo: isLowConfidence, questions };
}

export function computeUrgencyAdjustment(classification, answers) {
  const critical = actionCriticalQuestions[classification.predictedType] || actionCriticalQuestions["other cybercrime"];
  let escalate = false;
  const urgentActions = [];

  for (const q of critical) {
    const answer = answers[q.id];
    if (!answer) continue;

    const normalized = String(answer).toLowerCase();
    if (q.urgencyImpact === "yes_increases" && normalized === "yes") {
      escalate = true;
      urgentActions.push(q.actionAdvice || q.text);
    }
    if (q.urgencyImpact === "no_increases" && normalized === "no") {
      escalate = true;
      urgentActions.push(q.actionAdvice || `Action required: ${q.text}`);
    }
  }

  return { escalate, urgentActions, reasons: urgentActions };
}
