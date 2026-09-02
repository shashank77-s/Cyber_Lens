/**
 * Follow-Up Question Bank — actionCritical questions are asked for
 * the detected fraud type. Each question now includes concrete victim
 * advice (actionAdvice) that is triggered when urgent attention is needed.
 */

export const actionCriticalQuestions = {
  "UPI payment fraud": [
    {
      id: "acc_access",
      text: "Can the scammer still access your bank account or UPI app?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Call your bank immediately to block internet banking, disable UPI services, and freeze linked cards.",
    },
    {
      id: "bank_contacted",
      text: "Have you already called your bank to block/freeze the transaction?",
      type: "yesno",
      urgencyImpact: "no_increases",
      actionAdvice: "Call your bank's 24x7 fraud hotline immediately and dial 1930 within the golden hour to freeze funds.",
    },
  ],
  "phishing scam": [
    {
      id: "creds_entered",
      text: "Did you enter a password or OTP on the link/page you were sent?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Change passwords for your email, bank, and social accounts immediately from a clean device and terminate all active sessions.",
    },
    {
      id: "password_changed",
      text: "Have you changed that password since?",
      type: "yesno",
      urgencyImpact: "no_increases",
      actionAdvice: "Reset your compromised password right now and enable Two-Factor Authentication (2FA) via an authenticator app.",
    },
  ],
  "fake loan app harassment": [
    {
      id: "still_contacting",
      text: "Are they still calling/messaging you or your contacts?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Do NOT pay any extortion money. Block the harassing numbers and preserve screenshots/audio recordings as evidence for police.",
    },
    {
      id: "app_permissions",
      text: "Does the app still have access to your phone contacts or gallery?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Revoke contacts/media permissions in Settings > Apps immediately and uninstall the unauthorized lending application.",
    },
  ],
  "SIM swap fraud": [
    {
      id: "sim_working",
      text: "Is your phone still without network signal right now?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Visit your telecom operator outlet immediately with original ID proof to cancel the fraudulent duplicate SIM and recover your number.",
    },
    {
      id: "telecom_contacted",
      text: "Have you contacted your telecom provider yet?",
      type: "yesno",
      urgencyImpact: "no_increases",
      actionAdvice: "Contact your telecom operator immediately from another phone to report an unauthorized SIM swap and prevent OTP theft.",
    },
  ],
  "peer to peer cryptocurrency fraud": [
    {
      id: "wallet_hash",
      text: "Do you still have the wallet address or transaction hash saved?",
      type: "yesno",
      urgencyImpact: "no_increases",
      actionAdvice: "Immediately copy and preserve the destination wallet address and blockchain TxID before chat histories are deleted.",
    },
    {
      id: "still_in_contact",
      text: "Are you still in contact with the other party?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Cease all further transfers. Do NOT send additional crypto for 'release fees' or 'taxes'. Save all chat transcripts.",
    },
  ],
  "online job scam": [
    {
      id: "more_payment_requested",
      text: "Are they asking you for another payment right now?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Stop sending money immediately. Real employers never ask candidates to pay for training, security deposits, or task unlocking.",
    },
  ],
  "social media account hacking": [
    {
      id: "account_access",
      text: "Are you currently locked out of your account?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Use the platform's official 'Hacked Account' recovery procedure and secure the recovery email associated with the account.",
    },
    {
      id: "contacts_warned",
      text: "Have you warned your contacts not to respond to messages from your account?",
      type: "yesno",
      urgencyImpact: "no_increases",
      actionAdvice: "Notify your family, friends, and colleagues via alternative channels so they do not fall for fraudulent money requests from your account.",
    },
  ],
  "other cybercrime": [
    {
      id: "ongoing",
      text: "Is this still actively happening right now?",
      type: "yesno",
      urgencyImpact: "yes_increases",
      actionAdvice: "Turn on Airplane Mode or disconnect your device from Wi-Fi and mobile data immediately, then dial 1930 from another phone.",
    },
  ],
};

export const genericClarifyingQuestions = {
  missingDate: { id: "when_happened", text: "Roughly when did this happen? (e.g. yesterday, 3 days ago, 15th July)", type: "text" },
  missingAmount: { id: "amount_involved", text: "Was any money involved? If so, roughly how much?", type: "text" },
  lowConfidence: { id: "more_detail", text: "Could you add a bit more detail about exactly what happened, step by step?", type: "text" },
};
