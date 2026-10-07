# HW3 — Resilient Event Hub — Task Decomposition

3 slices, 8 atomic commits (min 5 per assignment). No one-shot prompting.

---

## Slice → Sub-task Pipeline

| # | Sub-task | Slice | Output | Commit message |
|---|---|---|---|---|
| 1 | Docs | — | README, TASK_DECOMPOSITION, project-rules | `docs: define hw3 slices and audit plan` |
| 2 | Countdown logic | 1 | js/countdown.js | `feat(js): drift-free utc countdown engine` |
| 3 | Countdown UI | 1 | css/countdown.css | `feat(css): countdown display layout` |
| 4 | State machine | 2 | js/form-state.js | `feat(js): form state machine` |
| 5 | Landing page HTML | 2 | index.html | `feat(html): resilient landing page skeleton` |
| 6 | Double-submit guard | 3 | js/form-state.js (update) | `fix(js): prevent double submit with state lock` |
| 7 | XSS sanitization | 3 | js/form-state.js (update) | `fix(security): sanitize user input, drop innerhtml` |
| 8 | AI failure audit | — | AI_FAILURE_AUDIT.md | `docs(audit): document 3 ai failure modes and fixes` |

---

## Contract-First Constraints

### Time contract
- Target: `2027-01-01T00:00:00Z` (UTC ISO 8601).
- Parsed via `new Date(iso).getTime()`.
- Each tick: `remaining = Math.max(0, target - Date.now())`.
- Timer: recursive `setTimeout(tick, 250)`.
- `setInterval` forbidden.

### Form state contract
- States: `IDLE | SUBMITTING | SUCCESS | ERROR`.
- Allowed transitions:
  - IDLE → SUBMITTING (on submit)
  - SUBMITTING → SUCCESS (on 2xx)
  - SUBMITTING → ERROR (on error/timeout)
  - SUCCESS → IDLE (on reset)
  - ERROR → IDLE (on reset)
- Any other transition → throw.
- State exposed only via `subscribe(fn)` callback.

### Security contract
- No `innerHTML` on user-derived data.
- All status messages via `textContent`.
- Double-submit: `SUBMITTING` state locks submit button.
- CSP: `script-src 'self'`, no inline handlers.

---

## Acceptance Criteria

- [ ] Countdown drift < 500ms after 10 minutes.
- [ ] Tab throttling doesn't break countdown.
- [ ] Form has exactly 4 states, transitions validated.
- [ ] Submit button disabled in SUBMITTING.
- [ ] XSS payload rendered as plain text.
- [ ] Zero console errors.
- [ ] Live Defense: explain any line from git log.

---

## AI Failure Audit Outline (15% of grade)

Must document 3 real defects found in AI output:

1. **Defect description** — what AI got wrong.
2. **Diagnostic method** — how you caught it (git diff, DevTools, test).
3. **Refactored solution** — your clean, verified fix.

Common AI failure modes for this HW:
- `setInterval` drift
- `innerHTML` XSS
- Race condition in double-submit
- Timezone bug from `Date` local methods
- Memory leak from unremoved listeners

---

## Live Defense Test Cases

| Test | Change | Files touched |
|---|---|---|
| A | Target date → 1 min from now | index.html (1 line) |
| B | Add ERROR retry button behavior | form-state.js |
| C | Change form endpoint | form-state.js (1 line) |