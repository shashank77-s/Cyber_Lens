/**
 * Rule-based entity extraction — regex patterns are more reliable than a
 * general NER model for structured identifiers like UPI IDs and amounts,
 * and keeps the pipeline fast and free.
 */
export function extractEntities(text) {
  const entities = {
    amounts: [],
    dates: [],
    upiIds: [],
    phoneNumbers: [],
    transactionRefs: [],
  };

  const amountRegex = /(?:₹|rs\.?|inr)\s?[\d,]+(?:\.\d+)?|\b[\d,]{3,}\s?(?:rupees|rs)\b/gi;
  entities.amounts = [...new Set((text.match(amountRegex) || []).map((s) => s.trim()))];

  const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{1,2}\s?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s?\d{0,4}\b/gi;
  entities.dates = [...new Set((text.match(dateRegex) || []).map((s) => s.trim()))];

  const upiRegex = /\b[\w.\-]{2,}@[a-z]{2,}\b/gi;
  entities.upiIds = [...new Set((text.match(upiRegex) || []).map((s) => s.trim()))];

  const phoneRegex = /(?:\+91[\-\s]?)?\b[6-9]\d{9}\b/g;
  entities.phoneNumbers = [...new Set((text.match(phoneRegex) || []).map((s) => s.trim()))];

  const txnRegex = /\b(?:txn|utr|ref(?:erence)?|transaction)\s*(?:id|no|number)?\s*[:\-]?\s*([a-z0-9]{6,})\b/gi;
  let match;
  while ((match = txnRegex.exec(text)) !== null) {
    entities.transactionRefs.push(match[1]);
  }
  entities.transactionRefs = [...new Set(entities.transactionRefs)];

  return entities;
}
