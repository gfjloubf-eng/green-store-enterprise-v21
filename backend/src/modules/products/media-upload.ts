import type { ControllerRequest } from '../../controllers';

const MAX_BYTES = 300 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function cleanSegment(value: unknown, fallback: string): string {
  const cleaned = String(value ?? '').trim().replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned.slice(0, 80) || fallback;
}

function parseDataUrl(value: unknown): { contentType: string; bytes: Buffer } {
  if (typeof value !== 'string') throw new Error('image_data_required');
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !ALLOWED_TYPES.has(match[1])) throw new Error('image_type_invalid');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > MAX_BYTES) throw new Error('image_size_invalid');
  return { contentType: match[1], bytes };
}

export async function uploadProductImage(request: ControllerRequest): Promise<{ url: string; path: string }> {
  const body = (request.body ?? {}) as Record<string, unknown>;
  const { contentType, bytes } = parseDataUrl(body.dataUrl);
  const baseUrl = String(process.env.SUPABASE_URL ?? '').replace(/\/+$/, '');
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  const bucket = cleanSegment(process.env.SUPABASE_STORAGE_BUCKET, 'product-images');
  if (!baseUrl || !serviceRoleKey) throw new Error('storage_not_configured');
  const sku = cleanSegment(body.sku, 'unassigned');
  const extension = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const path = `products/${sku}/main-${Date.now()}.${extension}`;
  const response = await fetch(`${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': contentType,
      'Content-Length': String(bytes.byteLength),
      'x-upsert': 'false',
    },
    body: bytes as unknown as BodyInit,
  });
  if (!response.ok) throw new Error(`storage_upload_failed_${response.status}`);
  return {
    path,
    url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path}`,
  };
}
