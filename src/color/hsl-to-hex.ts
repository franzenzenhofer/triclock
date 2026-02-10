export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number): string => {
    const k = (n + h / 30) % 12;
    const c = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
