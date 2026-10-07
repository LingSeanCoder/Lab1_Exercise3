// js/countdown.js
(() => {
  'use strict';

  const TICK_MS = 250;
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;
  const MS_PER_DAY = 24 * MS_PER_HOUR;

  const breakdown = (remainingMs) => {
    const days = Math.floor(remainingMs / MS_PER_DAY);
    const hours = Math.floor((remainingMs % MS_PER_DAY) / MS_PER_HOUR);
    const minutes = Math.floor((remainingMs % MS_PER_HOUR) / MS_PER_MINUTE);
    const seconds = Math.floor((remainingMs % MS_PER_MINUTE) / MS_PER_SECOND);
    return { days, hours, minutes, seconds };
  };

  const startCountdown = (targetIso, onTick) => {
    const targetMs = new Date(targetIso).getTime();

    if (Number.isNaN(targetMs)) {
      throw new Error('Invalid ISO 8601 target');
    }

    let timeoutId = null;
    let stopped = false;

    const tick = () => {
      if (stopped) return;

      const now = Date.now();
      const remaining = Math.max(0, targetMs - now);
      const parts = breakdown(remaining);

      onTick?.(remaining, parts);

      if (remaining > 0) {
        timeoutId = setTimeout(tick, TICK_MS);
      } else {
        stopped = true;
        timeoutId = null;
      }
    };

    tick();

    const stop = () => {
      if (stopped) return;
      stopped = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return stop;
  };

  window.Countdown = Object.freeze({ start: startCountdown });
})();