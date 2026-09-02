import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_BASE = "https://router.huggingface.co/hf-inference/models";

const hfClient = axios.create({
  headers: { Authorization: `Bearer ${HF_TOKEN}` },
  timeout: 30000,
});

/**
 * Zero-shot classification via facebook/bart-large-mnli.
 * The router endpoint returns an array of { label, score } objects,
 * already sorted highest-score-first.
 */
export async function classifyFraudType(text) {
  const labels = [
    "UPI payment fraud",
    "phishing scam",
    "peer to peer cryptocurrency fraud",
    "fake loan app harassment",
    "SIM swap fraud",
    "online job scam",
    "social media account hacking",
    "other cybercrime",
  ];

  const res = await hfClient.post(
    `${HF_BASE}/facebook/bart-large-mnli`,
    { inputs: text, parameters: { candidate_labels: labels } }
  );

  const results = res.data;
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Unexpected response from classification model: " + JSON.stringify(res.data));
  }

  return {
    predictedType: results[0].label,
    confidence: results[0].score,
    allScores: results.map((r) => ({ label: r.label, score: r.score })),
  };
}

/**
 * Translation to English using facebook/nllb-200-distilled-600M.
 * srcLang uses NLLB's language codes, e.g. "hin_Deva", "kan_Knda".
 */
export async function translateToEnglish(text, srcLang) {
  if (srcLang === "eng_Latn") return text;

  const res = await hfClient.post(
    `${HF_BASE}/facebook/nllb-200-distilled-600M`,
    { inputs: text, parameters: { src_lang: srcLang, tgt_lang: "eng_Latn" } }
  );

  const payload = Array.isArray(res.data) ? res.data[0] : res.data;
  return payload?.translation_text || text;
}

export default hfClient;
