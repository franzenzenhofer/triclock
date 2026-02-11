import type { TrichronoConfig, TimeValues } from '../types/index.js';
import type { DateSelection } from './date-selector.js';
import { formatDigital } from '../time/format-digital.js';
import { shareClockImage } from './share-time.js';

function buildMeetTitle(dateLabel: string, timeStr: string): string {
  if (dateLabel === 'today') return "Let's meet today at " + timeStr;
  if (dateLabel === 'tomorrow') return "Let's meet tomorrow at " + timeStr;
  return "Let's meet on " + dateLabel + ' at ' + timeStr;
}

export async function shareMeetImage(
  canvas: HTMLCanvasElement,
  config: TrichronoConfig,
  time: TimeValues,
  date: DateSelection,
): Promise<void> {
  const timeStr = formatDigital(time, false);
  await shareClockImage({
    canvas, config, time,
    title: buildMeetTitle(date.label, timeStr),
    prefix: 'triclock-meet-' + date.prefix + '-',
  });
}
