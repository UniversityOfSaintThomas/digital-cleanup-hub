# Session Recap — Digital Cleanup Hub

## What this is

A React + TypeScript + Vite + Tailwind site that serves as a reusable resource for hosting "Digital Cleanup" sustainability events. Grew out of an Earth Day workshop by the ITS Sustainability Team and the Office of Sustainability Initiatives (OSI) at the University of St. Thomas. Branded with the official UST identity.

**Live (org):** https://universityofsaintthomas.github.io/digital-cleanup-hub/
**Live (personal mirror):** https://mavereks.github.io/digital-cleanup-hub/

---

## Project structure

```
digitalcleanup/
├── src/
│   ├── components/
│   │   ├── EarthDayHub.tsx              ← main component (5 tabbed sections)
│   │   ├── StorageImpactCalculator.tsx  ← storage CO₂ estimator (audited engine)
│   │   └── BehaviorSavingsPanel.tsx     ← email/camera-off "sends avoided" panel
│   ├── lib/                             ← pure calc logic + unit tests (vitest)
│   │   ├── constants.ts                 ← authoritative storage constants (source of truth)
│   │   ├── co2.ts                       ← estimateAnnualCO2() storage engine
│   │   ├── behavior-constants.ts        ← email/video transmission constants
│   │   ├── behavior.ts                  ← estimateBehaviorSavings()
│   │   ├── co2.test.ts                  ← tests (excluded from prod tsc build)
│   │   └── behavior.test.ts
│   ├── App.tsx                          ← renders EarthDayHub
│   ├── main.tsx                         ← React root
│   ├── index.css                        ← Tailwind directives
│   └── vite-env.d.ts                    ← Vite client types (import.meta.env)
├── docs/co2-methodology.md             ← methodology + sources (mirrors constants.ts)
├── public/
│   ├── sustainability-shield.png        ← header logo + favicon
│   ├── ust-signature-white.png          ← footer institutional signature
│   ├── sustainable-st-thomas.png        ← (spare brand asset)
│   └── favicon.svg                      ← (original, now unused)
├── index.html
├── package.json                         ← vite@8, react@18, lucide-react, tailwind, vitest
├── vite.config.ts                       ← base: './' (relative — see notes)
├── tailwind.config.js                   ← UST brand palette (plum, leaf, orchid)
├── postcss.config.js
├── tsconfig.json / tsconfig.node.json
├── .gitignore
└── .github/workflows/deploy.yml         ← GitHub Actions → Pages (Node 24)
```

The old root `earth-day-cloud-workshop.tsx` was deleted — it was an unused duplicate with a
storage-math bug (2 kg/GB). The live component is `src/components/EarthDayHub.tsx`.

---

## Status — all done ✅

| Task | Done? |
|---|---|
| Vite + React + TS + Tailwind scaffold | ✅ |
| Component typed + moved to `src/components/` | ✅ |
| Node.js installed (v26.3.0 via Homebrew) | ✅ |
| `npm install` + production build verified | ✅ |
| Renamed to "Digital Cleanup Hub" | ✅ |
| Rebranded with UST identity (colors, shield, signature) | ✅ |
| GitHub Actions deploy workflow (Node 24) | ✅ |
| Pushed to org + personal repos | ✅ |
| **Live and loading on org repo** | ✅ |
| Calculator rebuilt: audited engine + behavior panel + tests | ✅ |

---

## Git remotes & branches

- `origin` → `git@github.com:UniversityOfSaintThomas/digital-cleanup-hub.git` (primary)
- `personal` → `git@github.com:mavereks/digital-cleanup-hub.git` (mirror)
- Branches: `main` (deploys) and `dev` (work-in-progress; no deploy trigger)
- Tag: `v1.0-earth-day` → commit `8994703`, the pre-rebrand snapshot

**Workflow for new changes:**
```bash
git checkout dev
# ...make changes; eyeball with: npm run dev
npm test && npm run build                                # the real pre-merge check (build = what Pages runs)
git add . && git commit -m "..." && git push origin dev  # pushes dev to origin
git checkout main && git merge dev && git push           # deploys via origin
git push personal main dev                               # keep mirror in sync
```

---

## Calculator architecture (added after the rebrand)

The original "Quick workshop calculator" used a wrong flat figure (2 kg/GB). It was replaced with
an audited, range-based engine. Math lives in pure, unit-tested functions; the components are thin
UI over them.

- **`src/lib/constants.ts`** is the authoritative source of truth for storage numbers and mirrors
  `docs/co2-methodology.md`. **If you change a value, update the constant, the doc, the citation,
  and the test together.**
- **`src/lib/co2.ts`** → `estimateAnnualCO2()`: `kg CO₂e/yr = TB × R × (E_op × CI + Emb)`. Returns a
  central value + low/high range. HDD has a central; SSD is **range-only** (`central: null`) because
  published LCAs disagree ~50×.
- **`src/lib/behavior.ts`** → `estimateBehaviorSavings()`: emails-avoided + camera-off hours,
  range-only (transmission estimates are far less settled than storage).
- **Components:** `StorageImpactCalculator.tsx` (grid / replication / HDD-SSD / institutional-scale
  toggles) and `BehaviorSavingsPanel.tsx`. Both link to the methodology doc via `METHODOLOGY_URL`
  (points at `docs/co2-methodology.md` on org `main`).
- **Tests:** `npm test` (vitest, 21 tests). Tests are excluded from the production `tsc` build via
  `"exclude": ["src/**/*.test.*"]` in `tsconfig.json` — without that, `tsc` fails on the vitest
  imports and the Pages deploy breaks.

---

## Key config notes

- **`vite.config.ts` `base` is `'./'` (relative).** This was the fix for the 404 problem.
  GitHub Pages redirects to an internal CDN URL (`*.pages.github.io/`) that serves the
  build from the **root**, not from `/digital-cleanup-hub/`. An absolute base baked
  `/digital-cleanup-hub/assets/...` into the HTML, which 404'd on the CDN root. Relative
  paths (`./assets/...`) resolve no matter where the site is served from.
  ⚠️ The comment inside `vite.config.ts` still says "set base to repo name" — that's now
  misleading; leave `base: './'` as-is.
- **Node**: installed at `/opt/homebrew/bin/node` (v26.3.0). If `node` isn't found in a new
  terminal: `export PATH="/opt/homebrew/bin:$PATH"` (or add to `~/.zshrc`).
- **`package.json`** uses `vite@8` with `@vitejs/plugin-react@^6` (v6 required for Vite 8).
- **Brand assets** live in `public/` and are referenced via `import.meta.env.BASE_URL` so they
  survive any future base-path change.

---

## Component overview

`EarthDayHub` — 5 tabbed sections, sidebar nav (desktop) / bottom nav (mobile):

| # | Section | Key content |
|---|---|---|
| 01 | Why It Matters | "Host your own event" banner, stats, 3 drivers, rules-of-thumb table, dark-data callout |
| 02 | Cleanup Guides | 6 platform tabs: Outlook, OneDrive, SharePoint, Canvas, Zoom, Panopto |
| 03 | Impact Tools | Storage estimator + behavior panel (audited engine), tool links, corrected formulas |
| 04 | Behavior Change | Habits for individuals, teams, instructors, and IT |
| 05 | Running the Event | 60-min agenda, pre-event checklist, email templates, success metrics |

Header: Sustainable St. Thomas shield + title. Footer: UST signature + OSI credit (dark purple).
