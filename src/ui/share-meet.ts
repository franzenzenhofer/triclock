import type { TrichronoConfig, TimeValues } from '../types/index.js';
import { formatDigital } from '../time/format-digital.js';
import { shareClockImage } from './share-time.js';

export async function shareMeetImage(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
  time: TimeValues,
): Promise<void> {
  const timeStr = formatDigital(time, false);
  await shareClockImage({
    canvas, config, time,
    title: "Let's meet at " + timeStr,
    prefix: 'triclock-meet-',
  });
}
