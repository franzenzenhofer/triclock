import type { TrichronoConfig, TimeValues } from '../types/index.js';
import { formatDigital } from '../time/format-digital.js';
import { configToHash } from '../config/hash.js';
import { renderShareCanvas } from './share-time.js';
import { canvasToBlob, shareOrDownload } from './share-utils.js';

export async function shareMeetImage(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
  time: TimeValues,
): Promise<void> {
  const timeStr = formatDigital(time, false);
  const hash = configToHash(config);
  const url = window.location.origin + window.location.pathname + (hash ? '#' + hash : '');
  const title = "Let's meet at " + timeStr;
  const text = title + '\n' + url;
  const filename = 'triclock-meet-' + timeStr.replace(/:/g, '') + '.png';

  const shareCanvas = renderShareCanvas(canvas, config, time);
  const blob = await canvasToBlob(shareCanvas);
  await shareOrDownload(blob, filename, title, text);
}
