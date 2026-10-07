// js/form-state.js
(() => {
  'use strict';

  const STATES = Object.freeze({
    IDLE: 'IDLE',
    SUBMITTING: 'SUBMITTING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  });

  const TRANSITIONS = Object.freeze({
    IDLE: ['SUBMITTING'],
    SUBMITTING: ['SUCCESS', 'ERROR'],
    SUCCESS: ['IDLE'],
    ERROR: ['IDLE']
  });

  let state = STATES.IDLE;
  const listeners = new Set();

  const transition = (next) => {
    if (!TRANSITIONS[state].includes(next)) {
      throw new Error(`Invalid transition: ${state} -> ${next}`);
    }
    state = next;
    listeners.forEach((fn) => fn(state));
  };

  const getState = () => state;

  const subscribe = (fn) => {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
  };

  const reset = () => {
    state = STATES.IDLE;
    listeners.forEach((fn) => fn(state));
  };

  window.FormState = Object.freeze({
    STATES,
    getState,
    subscribe,
    transition,
    reset
  });
})();