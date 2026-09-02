/**
 * Timeline Reconstruction — orders incident-description sentences into a
 * clean chronological sequence using explicit dates/times and relative
 * time phrases ("first", "then", "later", "finally").
 */

const RELATIVE_ORDER_HINTS = [
  { pattern: /\b(initially|first|to begin with)\b/i, weight: 1 },
  { pattern: /\b(then|after that|next|following this)\b/i, weight: 3 },
  { pattern: /\b(later|subsequently|afterward)\b/i, weight: 4 },
  { pattern: /\b(finally|eventually|in the end)\b/i, weight: 6 },
  { pattern: /\b(currently|now|as of now|still)\b/i, weight: 7 },
];

const DATE_REGEX = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{1,2}\s?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s?\d{0,4}\b/gi;
const TIME_REGEX = /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/gi;

function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
}

export function reconstructTimeline(text) {
  const sentences = splitSentences(text);

  const events = sentences.map((sentence, index) => {
    const dateMatch = sentence.match(DATE_REGEX);
    const timeMatch = sentence.match(TIME_REGEX);

    let orderWeight = 5;
    for (const hint of RELATIVE_ORDER_HINTS) {
      if (hint.pattern.test(sentence)) {
        orderWeight = hint.weight;
        break;
      }
    }

    return {
      text: sentence,
      date: dateMatch ? dateMatch[0] : null,
      time: timeMatch ? timeMatch[0] : null,
      hasExplicitDate: !!dateMatch,
      originalIndex: index,
      orderWeight,
    };
  });

  const sorted = [...events].sort((a, b) => {
    if (a.hasExplicitDate !== b.hasExplicitDate) return a.hasExplicitDate ? -1 : 1;
    if (a.orderWeight !== b.orderWeight) return a.orderWeight - b.orderWeight;
    return a.originalIndex - b.originalIndex;
  });

  return sorted.map((e, i) => ({ step: i + 1, text: e.text, date: e.date, time: e.time }));
}
