// js/app.js
(() => {
  'use strict';

  // ----- Countdown wiring -----
  const el = document.querySelector('.countdown');
  if (el) {
    const target = el.dataset.target;
    const units = {
      days: el.querySelector('[data-unit="days"]'),
      hours: el.querySelector('[data-unit="hours"]'),
      minutes: el.querySelector('[data-unit="minutes"]'),
      seconds: el.querySelector('[data-unit="seconds"]')
    };

    window.Countdown?.start(target, (_remaining, parts) => {
      units.days.textContent = String(parts.days).padStart(2, '0');
      units.hours.textContent = String(parts.hours).padStart(2, '0');
      units.minutes.textContent = String(parts.minutes).padStart(2, '0');
      units.seconds.textContent = String(parts.seconds).padStart(2, '0');
    });
  }

  // ----- Form state machine wiring -----
  const form = document.getElementById('register-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form && status && submitBtn) {
    const { STATES, getState, transition, subscribe } = window.FormState;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (getState() === STATES.SUBMITTING) return;

      transition(STATES.SUBMITTING);

      try {
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();

        if (name.length < 2 || !email.includes('@')) {
          throw new Error('Invalid input');
        }

        await new Promise((r) => setTimeout(r, 800)); // mock network

        transition(STATES.SUCCESS);
        status.textContent = 'Registered. Check your email.';
        form.reset();
        setTimeout(() => transition(STATES.IDLE), 1500);
      } catch {
        transition(STATES.ERROR);
        status.textContent = 'Something went wrong. Please try again.';
        setTimeout(() => transition(STATES.IDLE), 2500);
      }
    });

    subscribe((state) => {
      submitBtn.disabled = state === STATES.SUBMITTING;
      submitBtn.setAttribute('aria-busy', String(state === STATES.SUBMITTING));
    });
  }
})();