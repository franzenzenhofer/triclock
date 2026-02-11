export function hslToRgb01(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const sN = Math.max(0, Math.min(100, s)) / 100;
  const lN = Math.max(0, Math.min(100, l)) / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number): number => {
    const k = (n + h / 30) % 12;
    const t1 = Math.max(0, Math.min(1, (k - 2) / 2));
    const t2 = Math.max(0, Math.min(1, (k - 8) / 2));
    const s1 = t1 * t1 * (3 - 2 * t1);
    const s2 = t2 * t2 * (3 - 2 * t2);
    return lN - a * (-1 + 2 * s1 - 2 * s2);
  };
  return [f(0), f(8), f(4)];
}
