// The mode-cycling intro plays once per install: the first launch ever.
// The flag lives in localStorage, which the iOS wrapper's persistent
// WKWebView data store keeps across app launches. A browser that blocks
// storage (it throws on access) keeps the old behaviour: the intro plays.
export const ONBOARDING_SEEN_KEY = 'triclock.onboardingSeen';
const SEEN_VALUE = '1';

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === SEEN_VALUE;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[triclock] onboarding flag unreadable, intro plays', error);
    return false;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, SEEN_VALUE);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[triclock] onboarding flag not saved', error);
  }
}
