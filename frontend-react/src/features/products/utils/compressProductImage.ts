export interface CompressedImage {
  dataUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: 'image/webp' | 'image/jpeg';
}

const MAX_EDGE = 1200;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const TARGET_OUTPUT_BYTES = 250 * 1024;

function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.floor((base64.length * 3) / 4);
}

async function loadImageSource(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return { source: bitmap, width: bitmap.width, height: bitmap.height, cleanup: () => bitmap.close() };
    } catch {
      // Fall through to the HTMLImageElement path for Safari and older mobile browsers.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('image_decode_failed'));
    element.src = objectUrl;
  });
  return { source: image, width: image.naturalWidth, height: image.naturalHeight, cleanup: () => URL.revokeObjectURL(objectUrl) };
}

export async function compressProductImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('image_type_invalid');
  if (file.size > MAX_INPUT_BYTES) throw new Error('image_too_large');

  const loaded = await loadImageSource(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(loaded.width, loaded.height));
    const width = Math.max(1, Math.round(loaded.width * scale));
    const height = Math.max(1, Math.round(loaded.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('image_canvas_unavailable');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(loaded.source, 0, 0, width, height);

    let quality = 0.84;
    let dataUrl = canvas.toDataURL('image/webp', quality);
    if (!dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }
    while (dataUrlBytes(dataUrl) > TARGET_OUTPUT_BYTES && quality > 0.58) {
      quality -= 0.04;
      dataUrl = canvas.toDataURL(dataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg', quality);
    }

    return {
      dataUrl,
      width,
      height,
      bytes: dataUrlBytes(dataUrl),
      format: dataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg',
    };
  } finally {
    loaded.cleanup();
  }
}

export function formatImageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}
