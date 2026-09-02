export const legalMapping = {
  "UPI payment fraud": {
    sections: [
      "IT Act Section 66C (Identity theft)",
      "IT Act Section 66D (Cheating by personation)",
      "BNS Section 318 (Cheating)",
    ],
    urgency: "high",
    evidence: [
      "Screenshot of the transaction (amount, time, UPI Ref / UTR ID)",
      "Bank statement showing the unauthorized debit",
      "Chat/call communications or phishing links sent by the fraudster",
      "Screenshot of the UPI app dispute confirmation",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Dial 1930 National Cybercrime Helpline",
        detail: "Call 1930 immediately within the golden hour (first 2-4 hours) to freeze unauthorized transfers across beneficiary accounts.",
      },
      {
        priority: "CRITICAL",
        action: "Freeze Bank Account & UPI PIN",
        detail: "Contact your bank's 24x7 emergency fraud hotline to block UPI transactions, freeze debit cards, and secure your account.",
      },
      {
        priority: "HIGH",
        action: "Dispute Transaction in UPI App",
        detail: "Open PhonePe/GPay/Paytm > Transaction Details > 'Having an Issue' / 'Report Fraud' to lodge an internal dispute with NPCI.",
      },
      {
        priority: "IMPORTANT",
        action: "Preserve Transaction Artifacts",
        detail: "Save the 12-digit UPI UTR reference number, debit SMS, and scammer UPI ID / phone number without deleting anything.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Official Police Complaint",
        detail: "Submit a formal report on cybercrime.gov.in using this generated draft and note your complaint acknowledgment number.",
      },
    ],
    guidance: "1. Dial 1930 immediately within the golden hour to freeze funds. 2. Contact your bank to block UPI and freeze compromised accounts. 3. Dispute the transaction within your UPI app. 4. Preserve the 12-digit UTR and debit SMS. 5. File this complaint at cybercrime.gov.in.",
  },

  "phishing scam": {
    sections: [
      "IT Act Section 66C (Identity theft)",
      "IT Act Section 66D (Cheating by personation)",
      "IT Act Section 43 (Unauthorized access to computer system)",
    ],
    urgency: "high",
    evidence: [
      "Full screenshot of the phishing SMS, WhatsApp message, or email",
      "Exact phishing URL / website link address",
      "Full email header details (if received via email)",
      "Bank/card debit alerts if credentials were used fraudulently",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Reset Account Passwords Immediately",
        detail: "Change credentials for your banking, email, and social accounts from a separate clean device. Select 'Log out of all devices'.",
      },
      {
        priority: "CRITICAL",
        action: "Enable Multi-Factor Authentication (2FA)",
        detail: "Turn on two-factor authentication using an Authenticator app (Google Authenticator / Authy) rather than vulnerable SMS OTP.",
      },
      {
        priority: "HIGH",
        action: "Block Compromised Cards / Banking",
        detail: "If you entered debit/credit card numbers or CVV, call your bank immediately to hotlist and re-issue the card.",
      },
      {
        priority: "IMPORTANT",
        action: "Document Phishing Artifacts",
        detail: "Take screenshots of the phishing message, sender phone/email, and the fraudulent web address before the page is taken down.",
      },
      {
        priority: "IMMEDIATE",
        action: "Report Phishing Link",
        detail: "Report the incident at cybercrime.gov.in and report the malicious link to Google Safe Browsing (safebrowsing.google.com).",
      },
    ],
    guidance: "1. Change passwords for compromised accounts immediately and force logout from all sessions. 2. Enable app-based 2FA. 3. Block bank cards if CVV or expiry was entered. 4. Screenshot the phishing message and URL. 5. File a report on cybercrime.gov.in.",
  },

  "peer to peer cryptocurrency fraud": {
    sections: [
      "IT Act Section 66D (Cheating by personation)",
      "BNS Section 318 (Cheating)",
    ],
    urgency: "high",
    evidence: [
      "Destination wallet address and blockchain transaction hash (TxID)",
      "Screenshot of P2P escrow trade order and chat log",
      "Crypto exchange account name and trade ID",
      "Bank transfer proof showing payment sent to scammer",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Stop All Further Transfers",
        detail: "Do NOT send additional funds for 'unfreezing', 'taxes', or 'platform verification'. Legitimate exchanges never ask for ransom payments.",
      },
      {
        priority: "CRITICAL",
        action: "Raise Exchange Escrow Dispute",
        detail: "Immediately open a dispute ticket on the crypto exchange (Binance, WazirX, CoinDCX) to freeze the counterparty's account.",
      },
      {
        priority: "HIGH",
        action: "Preserve Blockchain Transaction Hash",
        detail: "Record the exact public wallet address, network (TRC20, ERC20, BEP20), and transaction hash (TxID) from blockchain explorers.",
      },
      {
        priority: "IMPORTANT",
        action: "Export Complete Chat Logs",
        detail: "Export and screenshot Telegram/WhatsApp/exchange chat messages before the fraudster deletes or edits them.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Cybercrime Complaint",
        detail: "Submit on cybercrime.gov.in providing the TxID and wallet details so law enforcement can flag the address with exchanges.",
      },
    ],
    guidance: "1. Cease all payments immediately; ignore 'fee to release funds' demands. 2. File an escrow dispute with the crypto exchange. 3. Record the transaction hash (TxID) and wallet address. 4. Screenshot all chats and payment proofs. 5. Lodge a report at cybercrime.gov.in.",
  },

  "fake loan app harassment": {
    sections: [
      "IT Act Section 66C",
      "IT Act Section 67 (Publishing obscene material)",
      "BNS Section 351 (Criminal intimidation)",
      "BNS Section 356 (Defamation)",
    ],
    urgency: "high",
    evidence: [
      "Screenshots of app permissions requested (Contacts, Storage, Camera)",
      "Audio recordings or screenshots of abusive calls and threatening WhatsApp messages",
      "Morphed or defamatory images sent to you or your contacts",
      "UPI IDs and bank details where loan repayments were transferred",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Do NOT Pay Extortion Demands",
        detail: "Do not transfer any further money. Illegal loan apps continue blackmailing regardless of repayment.",
      },
      {
        priority: "CRITICAL",
        action: "Revoke Permissions & Uninstall App",
        detail: "Go to Phone Settings > Apps > [Loan App] > Permissions > Turn OFF Contacts, Storage, Camera, then uninstall.",
      },
      {
        priority: "HIGH",
        action: "Alert Your Family & Contacts",
        detail: "Send a broadcast message to your contacts: 'My phone was targeted by a malicious loan scam that stole my contacts list. Please ignore fake calls/morphed images.'",
      },
      {
        priority: "IMPORTANT",
        action: "Preserve Threat Artifacts",
        detail: "Backup WhatsApp chats, call recordings, and UPI repayment receipts as crucial evidence for police.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Police & RBI Sachet Complaints",
        detail: "File an emergency complaint on cybercrime.gov.in under 'Cyber Harassment' and report the unregistered app on the RBI Sachet portal (sachet.rbi.org.in).",
      },
    ],
    guidance: "1. Do NOT pay any extortion money. 2. Revoke all phone permissions and delete the app. 3. Alert your contacts to disregard fake calls/morphed photos. 4. Record and screenshot abusive communications. 5. File on cybercrime.gov.in and report to the RBI Sachet portal.",
  },

  "SIM swap fraud": {
    sections: [
      "IT Act Section 66C (Identity theft)",
      "IT Act Section 66D (Cheating by personation)",
    ],
    urgency: "high",
    evidence: [
      "Time when phone network/signal completely stopped working",
      "Unauthorized banking/wallet debit SMS alerts received after SIM swap",
      "Customer service interaction logs with telecom operator",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Visit Telecom Store Immediately",
        detail: "Visit the nearest official store of your telecom provider (Airtel, Jio, Vi) with original ID proof to cancel the duplicate SIM and reactivate yours.",
      },
      {
        priority: "CRITICAL",
        action: "Freeze Bank & UPI Accounts",
        detail: "From another phone, call your bank's 24x7 helpline immediately to block mobile banking, internet banking, and UPI linked to your number.",
      },
      {
        priority: "HIGH",
        action: "Dial Cyber Helpline 1930",
        detail: "Report financial siphoning immediately via 1930 to freeze unauthorized inter-bank transfers.",
      },
      {
        priority: "IMPORTANT",
        action: "Secure Email & 2FA Tokens",
        detail: "Change passwords on your primary email and switch 2FA from SMS to hardware keys or an authenticator app.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Formal Cyber Police Complaint",
        detail: "Register a complaint at cybercrime.gov.in including your SIM swap timestamp and telecom dispute ticket.",
      },
    ],
    guidance: "1. Visit your telecom provider's store immediately with government ID to block the cloned SIM. 2. Call your bank from another phone to freeze accounts. 3. Call 1930 to halt unauthorized debits. 4. Secure email accounts and change passwords. 5. File on cybercrime.gov.in.",
  },

  "online job scam": {
    sections: [
      "IT Act Section 66D (Cheating by personation)",
      "BNS Section 318 (Cheating)",
    ],
    urgency: "high",
    evidence: [
      "Screenshots of Telegram/WhatsApp task groups and recruiter chats",
      "Job offer letters, fake recruitment portal URLs, or fake contracts",
      "Payment receipts or UPI transactions for 'prepaid tasks' / 'crypto deposits'",
      "Phone numbers and usernames of scammers claiming to be HR/executives",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Stop All Task & Deposit Payments",
        detail: "Stop paying immediately. 'Prepaid task' and 'YouTube like/rating' jobs are 100% Ponzi scams; fake portal balances cannot be withdrawn.",
      },
      {
        priority: "CRITICAL",
        action: "Dial 1930 To Freeze Money",
        detail: "If you transferred funds recently, dial 1930 and contact your bank fraud cell with the transaction reference numbers.",
      },
      {
        priority: "HIGH",
        action: "Export Full Telegram / WhatsApp Chat",
        detail: "Export the full chat with media before the scammer deletes the channel or group.",
      },
      {
        priority: "IMPORTANT",
        action: "Report Fraudulent Channel",
        detail: "Report the scam group directly within Telegram/WhatsApp and report the impersonated company to their official HR department.",
      },
      {
        priority: "IMMEDIATE",
        action: "Lodge Police Complaint",
        detail: "File a complaint on cybercrime.gov.in with all payment proofs and bank transfer details.",
      },
    ],
    guidance: "1. Stop paying immediately; do NOT pay any 'withdrawal tax' or 'deposit fee'. 2. Call 1930 to request a bank freeze on transferred money. 3. Export all Telegram/WhatsApp task records. 4. Report the fake recruiter channel. 5. Submit your formal complaint at cybercrime.gov.in.",
  },

  "social media account hacking": {
    sections: [
      "IT Act Section 66C (Identity theft)",
      "IT Act Section 66E (Violation of privacy)",
      "IT Act Section 43 (Unauthorized access)",
    ],
    urgency: "high",
    evidence: [
      "Screenshot of unauthorized login alerts or lockout screens",
      "Screenshots of unauthorized posts, stories, or DMs sent by the hacker",
      "Email notifications of password / recovery phone changes",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Initiate Platform Hacked Recovery",
        detail: "Go to instagram.com/hacked, facebook.com/hacked, or Google Account Recovery immediately to initiate biometric/selfie identity verification.",
      },
      {
        priority: "CRITICAL",
        action: "Secure Linked Recovery Email",
        detail: "Hackers usually compromise your email first. Change your email password immediately and remove any forwarding rules created by the hacker.",
      },
      {
        priority: "HIGH",
        action: "Warn Friends & Followers",
        detail: "Post an alert on alternate platforms / WhatsApp status: 'My account was hacked. Do not click links or send money to messages from that account.'",
      },
      {
        priority: "IMPORTANT",
        action: "Revoke Third-Party App Permissions",
        detail: "Check connected apps and revoke permissions for any suspicious third-party utilities or integrations.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Cyber Police Report",
        detail: "File a report on cybercrime.gov.in under 'Social Media Crimes' if extortion, impersonation, or privacy violation is involved.",
      },
    ],
    guidance: "1. Initiate platform hacked recovery (instagram.com/hacked or platform help center). 2. Secure and change your linked email password. 3. Warn your contacts through other channels not to trust messages from your account. 4. Remove rogue connected apps. 5. File a report on cybercrime.gov.in.",
  },

  "other cybercrime": {
    sections: [
      "IT Act Section 66 (Computer-related offences)",
      "IT Act Section 66D (Cheating using computer resource)",
      "BNS Section 318 (Cheating)",
    ],
    urgency: "high",
    evidence: [
      "High-resolution screenshots of all relevant chats, messages, and calls",
      "Bank/payment statements and transaction IDs (if financial loss occurred)",
      "Screenshots of suspicious URLs, emails with full headers, or installed apps",
      "Date, time, and device logs of when the incident occurred",
    ],
    actionSteps: [
      {
        priority: "CRITICAL",
        action: "Dial 1930 & Freeze Bank Accounts",
        detail: "If any unauthorized transaction or financial loss took place, call National Cybercrime Helpline 1930 immediately within the golden hour to freeze funds.",
      },
      {
        priority: "CRITICAL",
        action: "Isolate Compromised Devices",
        detail: "Turn on Airplane Mode or disconnect from Wi-Fi/mobile data immediately if remote access software (AnyDesk, TeamViewer) or unknown APKs were installed.",
      },
      {
        priority: "HIGH",
        action: "Change Passwords & Enable 2FA",
        detail: "Reset passwords for your primary email, banking apps, and social accounts from a clean device. Terminate all active sessions and enable app-based 2FA.",
      },
      {
        priority: "IMPORTANT",
        action: "Preserve Forensic Evidence",
        detail: "Do NOT delete messages, chats, call logs, or suspicious emails. Take clear screenshots with timestamps and UTR transaction numbers.",
      },
      {
        priority: "IMMEDIATE",
        action: "File Official Police Complaint",
        detail: "Register a formal complaint on the National Cyber Crime Reporting Portal at cybercrime.gov.in using this generated draft and attach your evidence.",
      },
    ],
    guidance: "1. Call 1930 immediately if money was debited to request a financial freeze. 2. Disconnect Wi-Fi/mobile data if unauthorized remote apps were installed. 3. Change passwords and enable 2FA on email and banking accounts. 4. Preserve screenshots of chats, transactions, and phone numbers. 5. File this complaint draft on cybercrime.gov.in.",
  },
};

export function getLegalInfo(fraudType) {
  return legalMapping[fraudType] || legalMapping["other cybercrime"];
}
