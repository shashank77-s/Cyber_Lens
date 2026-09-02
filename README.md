# CyberShield AI — Complete Project

An NLP-based cybercrime complaint classification and drafting assistant.
This zip contains EVERYTHING built across all sessions, merged into one
working project.

## What's included
- **Core pipeline**: text/voice incident intake (English/Hindi/Kannada) → NLP
  fraud classification → entity extraction → legal section mapping →
  timeline reconstruction → platform-specific guidance → PDF draft export
- **Follow-up questions**: after the first analysis, the system asks
  urgency-critical and clarifying questions, then refines the classification
  and urgency based on the answers
- **Auth + three-tier roles**: User → Officer (police reviewer) → Admin
  (manages officers)
- **Case status tracker**: users save complaints, officers/admins review and
  update status (Filed / Under Review / Resolved / Rejected) with notes
- **Event/activity log**: every case tracks its own history — filed,
  follow-up answered, status changes, notes added — each attributed to
  who did it and when, viewable via "View activity" on any case
- **Secret-key admin registration**: entering the correct `ADMIN_SECRET_KEY`
  at signup creates an admin account directly, instead of needing a manual
  database edit
- **Login required to use the app**: the intake page is gated behind
  authentication, so every complaint is tied to an account from the start
- **Polished UI**: toasts, role badges, avatars, stat cards, search/filter

---

## 1. Prerequisites
- Node.js LTS — https://nodejs.org
- VS Code
- A free HuggingFace account — https://huggingface.co/join
- A free MongoDB Atlas account — https://www.mongodb.com/cloud/atlas/register

## 2. Get your HuggingFace token
1. https://huggingface.co/settings/tokens → **Create new token**
2. Choose **Fine-grained**, name it anything
3. Under permissions, check **"Make calls to Inference Providers"**
4. Create → copy the token (starts with `hf_...`)

*(A plain "Read" token will fail with a permissions error — it must be fine-grained with that specific permission checked.)*

## 3. Set up MongoDB Atlas
1. Create a free cluster (M0 tier)
2. Database Access → add a database user with a password
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for development
4. Connect → Drivers → copy the connection string
5. Add a database name at the end: `.../cybershield`

## 4. Configure the backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and fill in:
```
HUGGINGFACE_API_KEY=hf_your_actual_token_here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cybershield
JWT_SECRET=generate_this_below
ADMIN_SECRET_KEY=pick_any_private_string_you_want
PORT=5000
```
Generate a `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it:
```bash
npm run dev
```
You should see both `MongoDB connected` and `CyberShield backend running on http://localhost:5000`.

## 5. Configure the frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`).

## 6. Create your first admin account
Set your own secret value for `ADMIN_SECRET_KEY` in `backend/.env` — pick anything, e.g. `cybershield-admin-2026`. Restart the backend after editing `.env`.

Then on the **Register** page:
1. Fill in name, email, password as normal
2. Click **"Registering as an administrator?"** to reveal an extra field
3. Enter the exact `ADMIN_SECRET_KEY` value from your `.env`
4. Register — this account is created directly as `admin`

Keep that key private — anyone who has it can self-register as admin. Share it only with your project team.

*(Promoting an already-existing regular user to admin still requires a manual database edit — the secret key only applies at the moment of registration, and the Manage Officers panel intentionally can only toggle Officer/User, never Admin.)*

## 7. Note: login is now required to use the app
The intake page (`/`) is behind login — anyone visiting the site is redirected to **Register/Login** before they can describe an incident. This ties every complaint to an account from the start, which the case tracker and event log both depend on.

## 8. Try the full flow
1. **Register your admin account** using the secret key (step 6)
2. **Register a second test account** — this one stays a `user`. Log in with it.
3. **As that user:** you're taken straight to the intake page — describe an incident, answer the follow-up questions, save the case, check **My Complaints**. Click **View activity** on the saved case to see its event log (currently just "Complaint filed…")
4. **As admin:** go to **Manage Officers**, promote a third test account to `officer`
5. **As that officer:** go to **Review Complaints** — search, filter, update the saved case's status, add a note. Click **View activity** — you'll now see the status-change and note events too
6. **Back as the original user:** check **My Complaints** — updated status, note, and full activity log, all attributed to the reviewing officer

## Project structure
```
backend/
  server.js
  routes/       — analyze, refine, draft, auth, cases, admin
  models/       — User, Case
  middleware/   — auth (JWT + role checks)
  utils/        — huggingface, entityExtractor, timelineReconstructor, followUpEngine
  data/         — legalMapping, platformGuidance, followUpQuestions

frontend/
  src/
    App.jsx     — routing + main intake page
    api/        — axios instance with auto token
    context/    — AuthContext, ToastContext
    components/ — LanguageSelector, VoiceInput, DraftPreview, FollowUpPanel,
                  ProtectedRoute, UIKit (badges/avatars/stat cards)
    pages/      — Login, Register, MyCases, CaseReviewDashboard, ManageOfficers
```

## Troubleshooting quick reference
| Problem | Cause | Fix |
|---|---|---|
| `ENOTFOUND api-inference.huggingface.co` | Old HF domain (retired) | Already fixed in this version — uses `router.huggingface.co` |
| `insufficient permissions` from HF | Read-only token | Create a **fine-grained** token with "Make calls to Inference Providers" checked |
| `Cannot read properties of undefined` | Response shape mismatch | Already fixed — this version parses the current HF response format |
| `MongoDB connection error` | Wrong URI, or IP not whitelisted | Check `.env`, and confirm Atlas Network Access allows your IP (or `0.0.0.0/0`) |
| Mic button says "not supported" | Browser | Use Chrome or Edge |
| Can't reach `/admin/officers` | Not an admin yet | Follow step 6 above |

## Notes for your viva
- Passwords hashed with bcrypt; roles never accepted from client requests (`user` is hardcoded at registration, `officer` only settable by an existing admin, `admin` only settable by direct DB edit)
- Classification uses `facebook/bart-large-mnli` (zero-shot — no custom training data needed); translation uses `facebook/nllb-200-distilled-600M`
- Follow-up answers trigger a **second classification pass** on the enriched text, generally improving confidence — a simple, explainable way to handle ambiguous initial descriptions
- Urgency escalation is rule-based (not another ML call) for speed, cost, and explainability
- Every complaint status change is attributed to the reviewing officer/admin (`reviewedBy`), giving basic accountability tracking
- The event log (`Event` model) is a separate audit trail from the case's current state — even if a case's status is overwritten, the history of *how it got there* is preserved as an append-only log, which is a reasonable talking point on data integrity if asked
- The admin secret key is checked with a strict equality comparison server-side and never echoed back in any response — a wrong or missing key silently falls through to a normal `user` registration rather than returning a distinguishable error, so the key's existence can't be probed for
