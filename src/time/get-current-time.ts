import type { TimeValues } from '../types/index.js';

export function getCurrentTime(): TimeValues {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    ms: now.getMilliseconds(),
  };
}
