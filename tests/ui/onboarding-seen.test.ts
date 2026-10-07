import { describe, it, expect, beforeEach } from 'vitest';
import {
  ONBOARDING_SEEN_KEY,
  hasSeenOnboarding,
  markOnboardingSeen,
} from '../../src/ui/onboarding-seen.js';

// Real Web Storage: vitest.config.ts starts the workers with --localstorage-file.
describe('onboarding seen flag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is unset on the first launch ever', () => {
    expect(hasSeenOnboarding()).toBe(false);
  });

  it('stays set once the intro has played', () => {
    markOnboardingSeen();
    expect(hasSeenOnboarding()).toBe(true);
    expect(localStorage.getItem(ONBOARDING_SEEN_KEY)).toBe('1');
  });

  it('ignores a value it did not write', () => {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    expect(hasSeenOnboarding()).toBe(false);
  });
});
