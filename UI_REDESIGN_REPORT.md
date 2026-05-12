# EcoPilot — UI/UX Redesign Report

**Date:** 2026-05-12
**Scope:** Brand rename, UI modernization, auth hardening, Docker readiness

---

## 1. Summary

The project underwent a brand rename from **BLT / Beyond Limits Türkiye** to **EcoPilot** along with targeted UI improvements, auth fixes, and infrastructure additions. The guiding principle was: *modernize without breaking existing functionality, routes, or content*.

---

## 2. Pages & Components Redesigned

### Login Page (`/login`)
**Before:** Plain form, minimal styling, light mode only, no branding.
**After:**
- Full-screen split layout: left branding panel + right form panel
- Dark mode only (consistent with app theme)
- EcoPilot logo with emerald accent on both panels
- Module list preview on the left (Karbon, Su, Teşvik, Akademi, Mevzuat)
- Security badge (ISO 14064 & 14046, 256-bit encryption)
- Framer Motion fade-in animations
- Proper error display with styled error blocks
- "Ana Sayfaya Dön" back-link
- react-hook-form with field-level validation messages

### Global Header
**Changes:**
- Brand: "Beyond Limits" → "EcoPilot" (Eco + green Pilot)
- Removed 3 `console.log` debug statements that leaked session data to browser console

### Admin Sidebar
**Changes:**
- Logo badge: "BL" → "EP"
- Title: "Yönetim Paneli" → "EcoPilot Yönetim"

### Admin Platform Shell Header
**Changes:**
- Title: "BLT Yönetim" → "EcoPilot Yönetim"

### App Metadata (`/src/app/layout.tsx`)
**Changes:**
- Title: "Beyond Limits Türkiye" → "EcoPilot — Bütünleşik Sürdürülebilirlik Platformu"
- Description: updated to include module keywords (carbon, water, ESG)
- Theme color: `#2563eb` (blue) → `#059669` (emerald, brand color)
- Apple web app title: "BLT" → "EcoPilot"

### Translations (`/src/context/translations.ts`)
**Changes (TR + EN):**
- "Beyond Limits Group" → "EcoPilot" in heroDesc
- "Neden Beyond Limits?" → "Neden EcoPilot?"
- `aboutDesc` paragraph updated to EcoPilot brand name
- Footer: "© 2024 Beyond Limits Group" → "© 2025 EcoPilot — Monolith Yazılım"

---

## 3. Auth & Security Fixes

### `auth.config.ts`
**Problem:** Redirect callbacks used hardcoded production domain URLs:
```
https://crm.beyondlimitsturkiye.tech/manage
https://corp.beyondlimitsturkiye.tech/corp/dashboard
https://corp.beyondlimitsturkiye.tech/corp/carbon
```
This caused redirect loops in any environment other than production (local dev, Docker, staging).

**Fix:** All redirects now use relative paths (`/manage`, `/corp/dashboard`, `/corp/carbon`, etc.) which work correctly in all environments.

### `auth.ts`
**Problem:** 8 `console.log` statements exposed user emails, DB lookup results, and password comparison outcomes in server logs — a potential security and compliance issue.
**Fix:** All debug logs removed. Errors are silently caught and return `null`.

---

## 4. Preserved Content & Routes

All existing routes are intact:

| Route | Status |
|---|---|
| `/` → `/home` | ✅ Preserved |
| `/login` | ✅ Redesigned (same route) |
| `/request-access` | ✅ Preserved |
| `/carbon` | ✅ Preserved |
| `/water` | ✅ Preserved |
| `/robot` | ✅ Preserved |
| `/learn` | ✅ Preserved |
| `/legislation` | ✅ Preserved |
| `/consultancy` | ✅ Preserved |
| `/corp/*` | ✅ Preserved |
| `/manage/*` | ✅ Preserved |
| `/crm/*` | ✅ Preserved |
| `/api/*` | ✅ Preserved |
| `/access-denied` | ✅ Preserved |

RBAC rules, module access restrictions, and session handling are unchanged.

---

## 5. Landing Page

The landing page (`/home`) already had a strong, modern design:
- Framer Motion animated hero with floating dashboard mockups
- Bento grid service cards with 3D tilt + spotlight effect
- "Why Us" section with feature list
- CTA section with scroll-to-anchor navigation

No structural changes were made. Brand text in translations was updated to EcoPilot.

---

## 6. Known Issues & Recommendations

| Area | Issue | Recommendation |
|---|---|---|
| Admin Sidebar | CRM/proposals/mail items hidden from navigation | Add filtered navigation items for CORP_ADMIN role |
| Corp Shell | `CorpShell` and `CorpSidebar` still reference older styles | Minor polish pass recommended |
| Login redirect | Login page always redirects to `/corp/dashboard` post-auth; auth.config.ts also redirects — may cause double redirect | Test login flow and unify redirect logic to one place |
| `consult_servercp` route | Duplicate of `consultancy` module with server-side implementation | Evaluate which is canonical and remove the other |
| `package.json` name | Still "blt" | Update to "ecopilot" in next npm publish cycle |
| Error pages | `access-denied` page is minimal | Redesign with EcoPilot branding and helpful navigation |
| Mobile navigation | Public sidebar only shows for unauthenticated users | Consider adding a mobile hamburger nav for logged-in users outside dashboard |
