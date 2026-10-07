# HW3 — Resilient Event Hub & AI Failure Audit

A resilient landing page with a drift-free UTC countdown engine, a
state-machine form (IDLE → SUBMITTING → SUCCESS/ERROR), and
XSS-safe double-submit prevention.

**Author:** Nguyễn Đình Sang

---

## Stack

| Layer | Tech |
|---|---|
| Markup | HTML5 semantic |
| Style | Modern CSS |
| Behavior | Vanilla ES6+ JS |
| Time | UTC ISO 8601 timestamps + `Date.now()` recalculation |
| Security | Zero `innerHTML` for user input, CSP strict |

---

## Project Structure

```text
hw3-resilient-hub/
├── index.html
├── README.md
├── TASK_DECOMPOSITION.md
├── AI_FAILURE_AUDIT.md # 15% of grade
├── project-rules.md
├── css/
│ ├── tokens.css
│ ├── reset.css
│ ├── layout.css
│ ├── countdown.css
│ └── form.css
└── js/
├── countdown.js
└── form-state.js
```


---

## 3 Slices

### Slice 1 — Drift-Free Countdown Engine

- Target time in **UTC ISO 8601** format: `2027-01-01T00:00:00Z`.
- Recalculates remaining time from `Date.now()` each tick.
- Uses recursive `setTimeout`, NOT `setInterval`.
- Immune to browser tab throttling.

### Slice 2 — State-Machine Form

- 4 states: `IDLE → SUBMITTING → SUCCESS | ERROR`.
- Explicit transition table.
- No implicit state flags.

### Slice 3 — Security Hardening

- Double-submit prevention via state lock.
- Input sanitization: `textContent` only, no `innerHTML`.
- CSP strict, zero inline handlers.

---

## AI Failure Audit — 15% of Grade

See [`AI_FAILURE_AUDIT.md`](./AI_FAILURE_AUDIT.md) for 3 documented
AI-induced defects with diagnostic method and refactored solution.

---

## Live Defense Prep

The instructor may ask:

- "Why not `setInterval`?" → because of background-tab throttling drift.
- "Show me where double-submit is prevented." → state machine `SUBMITTING` lock.
- "Explain any line from your git history." → see commit messages + WBS.

---

## Verification Checklist

```bash
grep -rn "innerHTML" js/                 # empty
grep -rn "setInterval" js/               # empty
grep -rn "onclick=\|onkeydown=" index.html  # empty