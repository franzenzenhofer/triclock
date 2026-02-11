export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

export function canNativeShare(file: File): boolean {
  try {
    return typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function shareOrDownload(
  blob: Blob,
  filename: string,
  title: string,
  text: string,
): Promise<void> {
  const file = new File([blob], filename, { type: 'image/png' });
  if (canNativeShare(file)) {
    try {
      await navigator.share({ title, text, files: [file] });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      downloadBlob(blob, filename);
    }
  } else {
    downloadBlob(blob, filename);
  }
}
