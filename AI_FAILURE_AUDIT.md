# AI Failure Mode Audit — HW3

Three defects found in AI-generated code during review. For each: the description, the diagnostic method, and the refactored solution.

---

## Defect 1 — `setInterval` drift in countdown

### Description

The first AI-generated `js/countdown.js` used `setInterval(tick, 1000)`. When the browser tab was backgrounded, Chromium throttled the timer to once per minute. On return, the countdown was off by several seconds.

### Diagnostic Method

*   Opened Chrome DevTools → Performance tab.
*   Recorded 2 minutes with the tab hidden using Chrome's tab switch.
*   Observed interval sequence: 1000ms, 1013ms, 998ms, ... cumulative drift.
*   Cross-checked against system UTC clock: +4.2s error after 5 min.

### Refactored Solution

Replaced `setInterval` with a recursive `setTimeout` that recalculates `remaining` from `Date.now()` each tick:

```javascript
const tick = () => {
  const remaining = Math.max(0, targetMs - Date.now());
  onTick(remaining, parts);
  if (remaining > 0) setTimeout(tick, 250);
};
```

**Result:** Zero drift regardless of tab throttling, because the recalculation is absolute (target - now), not incremental.

---

## Defect 2 — `innerHTML` XSS in form status

### Description

AI rendered the form status using `status.innerHTML = 'Welcome, ' + name`. Injecting `<img src=x onerror=alert(1)>` as the name executed the payload.

### Diagnostic Method

*   Opened DevTools → Elements, submitted the XSS payload.
*   Saw `<img>` injected into the DOM and the alert fired.
*   Confirmed CSP did not block it because `unsafe-inline` was not the cause — the issue was that the payload was inside user data.

### Refactored Solution

Replaced `innerHTML` with `textContent` for all user-derived strings:

```javascript
// Before
status.innerHTML = `Welcome, ${name}`;

// After
status.textContent = `Welcome, ${name}`;
```

**Result:** Payload renders as literal text, no execution.

---

## Defect 3 — Double-submit race condition

### Description

Rapid clicks on the submit button fired 5 concurrent submissions. The button had `disabled = true` set after the fetch started, so synchronous clicks in the same tick bypassed the guard.

### Diagnostic Method

*   Added `console.count('submit')` at the top of the handler.
*   Clicked submit 5 times in under 100ms using DevTools throttling.
*   Saw 5 counts before the first `disabled = true` applied.

### Refactored Solution

Moved the state check before any side effects and used the state machine as the lock:

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (window.FormState.getState() === 'SUBMITTING') return;
  window.FormState.transition('SUBMITTING'); // sync lock
  
  // ... async work
});
```

**Result:** Second click sees `SUBMITTING` state and returns early.

---

## Summary Table

| # | Defect | Caught by | Fix commit | 
| :--- | :--- | :--- | :--- | 
| **1** | `setInterval` drift | DevTools Performance | `feat(js): drift-free utc countdown engine` | 
| **2** | `innerHTML` XSS | Manual payload test | `fix(security): sanitize user input` | 
| **3** | Double-submit race | `console.count` + rapid click | `fix(js): prevent double submit` | 