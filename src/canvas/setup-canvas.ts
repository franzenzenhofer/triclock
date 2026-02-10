export function setupCanvas(canvasId: string): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) throw new Error(`Canvas element #${canvasId} not found`);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context');

  return { canvas, ctx };
}
