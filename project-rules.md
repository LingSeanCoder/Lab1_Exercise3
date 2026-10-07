# Project Rules — AI Agent Constitution (HW3)

> Parse this file BEFORE proposing any code change.

## Stack
- Vanilla HTML5, modern CSS, ES6+ JS only.
- No jQuery, Bootstrap, Tailwind, React, Vue, or any framework.
- No external CDN.

## Language
- `const` by default. `let` only if reassigned. **`var` forbidden.**
- No `innerHTML` for user-derived content.

## HTML
- No structural `<div>`. Only layout wrappers with class.
- Exactly one `<h1>`.
- No inline event handlers.

## CSS
- Hex only in `css/tokens.css` `:root`.
- Rule files use `var(--token)` only.
- Mobile-first.

## JavaScript
- Scripts are `defer` or external. No inline scripts.
- **Time:** `Date.now()` + recursive `setTimeout`. `setInterval` forbidden.
- **State:** explicit state machine, no boolean flags.
- **Security:** `textContent` only for user input.
- Zero console errors.

## Git
- Atomic commits only. One commit = one artifact.
- CSS + JS in same commit = 0 pts.
- Minimum 5 commits total.

## AI Collaboration
- One prompt = one file.
- Every prompt includes contract.
- Verify with grep before commit.
- Document AI defects in `AI_FAILURE_AUDIT.md`.