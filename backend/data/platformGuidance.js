export const platformGuidance = {
  "phonepe": { category: "UPI App", steps: ["Report in-app via PhonePe > Help > Report a Transaction", "Call PhonePe support: 080-68727374", "Also file on cybercrime.gov.in and call 1930"] },
  "google pay": { category: "UPI App", steps: ["Report via Google Pay app > Help & Feedback", "Contact Google Pay support through the app", "Also file on cybercrime.gov.in and call 1930"] },
  "gpay": { category: "UPI App", steps: ["Report via Google Pay app > Help & Feedback", "Contact Google Pay support through the app", "Also file on cybercrime.gov.in and call 1930"] },
  "paytm": { category: "UPI App", steps: ["Report via Paytm app > 24x7 Help", "Call Paytm support: 0120-4456456", "Also file on cybercrime.gov.in and call 1930"] },
  "bhim": { category: "UPI App", steps: ["Report via BHIM app > Support", "Contact NPCI support for BHIM-related disputes", "Also file on cybercrime.gov.in and call 1930"] },
  "sbi": { category: "Bank", steps: ["Call SBI 24x7 helpline: 1800-1234 to freeze the account", "Visit nearest branch with ID proof to file a dispute", "Also file on cybercrime.gov.in and call 1930 immediately"] },
  "hdfc": { category: "Bank", steps: ["Call HDFC Bank helpline: 1800-202-6161", "Use HDFC NetBanking > Report Fraud option", "Also file on cybercrime.gov.in and call 1930 immediately"] },
  "icici": { category: "Bank", steps: ["Call ICICI Bank helpline: 1800-1080", "Report via iMobile app > Customer Care", "Also file on cybercrime.gov.in and call 1930 immediately"] },
  "axis": { category: "Bank", steps: ["Call Axis Bank helpline: 1860-419-5555", "Report via Axis Mobile app", "Also file on cybercrime.gov.in and call 1930 immediately"] },
  "canara": { category: "Bank", steps: ["Call Canara Bank helpline: 1800-425-0018", "Visit nearest branch to request an account freeze", "Also file on cybercrime.gov.in and call 1930 immediately"] },
  "binance": { category: "Crypto Exchange", steps: ["Report via Binance Support > Report a scam", "Preserve wallet address and transaction hash as evidence", "Note: crypto transactions are largely irreversible — report quickly"] },
  "wazirx": { category: "Crypto Exchange", steps: ["Report via WazirX Support ticket", "Preserve wallet address and transaction hash as evidence", "Note: crypto transactions are largely irreversible — report quickly"] },
  "coindcx": { category: "Crypto Exchange", steps: ["Report via CoinDCX in-app support", "Preserve wallet address and transaction hash as evidence", "Note: crypto transactions are largely irreversible — report quickly"] },
  "whatsapp": { category: "Messaging Platform", steps: ["Use WhatsApp's in-app 'Report' on the contact/message", "Enable two-step verification immediately after regaining access", "Warn your contacts not to respond to messages sent during the hack"] },
  "instagram": { category: "Social Media", steps: ["Use Instagram's 'My account was hacked' recovery flow", "Report impersonating/scam posts via Instagram's report tool", "Change linked email/phone password if reused elsewhere"] },
  "telegram": { category: "Messaging Platform", steps: ["Report the user/channel via Telegram's in-app Report tool", "Preserve chat screenshots before the scammer deletes messages", "Avoid further payments even if asked for a 'refund processing fee'"] },
};

export function detectPlatformGuidance(text) {
  const lowerText = text.toLowerCase();
  const matches = [];

  for (const [key, info] of Object.entries(platformGuidance)) {
    const regex = new RegExp(`\\b${key.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (regex.test(lowerText)) {
      matches.push({ platform: key, ...info });
    }
  }

  return matches;
}
