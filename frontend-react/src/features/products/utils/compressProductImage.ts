export interface CompressedImage {
  dataUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: 'image/webp' | 'image/jpeg';
}

const MAX_EDGE = 1200;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.floor((base64.length * 3) / 4);
}

export async function compressProductImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('image_type_invalid');
  if (file.size > MAX_INPUT_BYTES) throw new Error('image_too_large');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('image_canvas_unavailable');
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.84;
  let dataUrl = canvas.toDataURL('image/webp', quality);
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }
  while (dataUrlBytes(dataUrl) > 250 * 1024 && quality > 0.58) {
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
}

export function formatImageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}
