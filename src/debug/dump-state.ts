import type { TimeValues, TrichronoConfig } from '../types/index.js';
import { fractionalize } from '../time/fractionalize.js';
import { computeBaseHsl } from '../color/compute-base-hsl.js';
import { hslToRgb01 } from '../color/hsl-to-rgb01.js';

export function dumpState(time: TimeValues, config: TrichronoConfig): void {
  const fracs = fractionalize(time);
  const hsl = computeBaseHsl(fracs, config.hsl);
  const [r, g, b] = hslToRgb01(hsl.h, hsl.s, hsl.l);
  const sector = Math.floor(hsl.h / 30);
  const phase = hsl.h / 60;

  // eslint-disable-next-line no-console
  console.table({
    'Raw Time': [String(time.hours), String(time.minutes).padStart(2, '0'), String(time.seconds).padStart(2, '0')].join(':') + '.' + String(time.ms).padStart(3, '0'),
    'Frac H': fracs.h.toFixed(6),
    'Frac M': fracs.m.toFixed(6),
    'Frac S': fracs.s.toFixed(6),
    'Hue (°)': hsl.h.toFixed(3),
    'Sat (%)': hsl.s.toFixed(3),
    'Lit (%)': hsl.l.toFixed(3),
    'Tint R': r.toFixed(6),
    'Tint G': g.toFixed(6),
    'Tint B': b.toFixed(6),
    'Sector (hue/30)': String(sector),
    'Plasma Phase (hue/60)': phase.toFixed(4),
    'Plasma Tint Blend': '0.45 (fixed in shader)',
    'Plasma Enabled': String(config.triangles.plasma.enabled),
  });
}
