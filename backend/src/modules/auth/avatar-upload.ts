import type { ControllerRequest } from '../../controllers';

const MAX_BYTES = 300 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function parseDataUrl(value: unknown): { contentType: string; bytes: Buffer } {
  if (typeof value !== 'string') throw new Error('image_data_required');
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !ALLOWED_TYPES.has(match[1])) throw new Error('image_type_invalid');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > MAX_BYTES) throw new Error('image_size_invalid');
  return { contentType: match[1], bytes };
}

function storageHeaders(apiKey: string, extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { apikey: apiKey, ...extra };
  // sb_secret keys are not JWTs; only legacy service_role JWTs belong in Authorization.
  if (apiKey.split('.').length === 3) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

export async function uploadAvatarImage(request: ControllerRequest, userId: string): Promise<{ url: string; path: string }> {
  const body = (request.body ?? {}) as Record<string, unknown>;
  const { contentType, bytes } = parseDataUrl(body.dataUrl);
  const baseUrl = String(process.env.SUPABASE_URL ?? '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  const bucket = 'avatars';
  if (!baseUrl || !serviceRoleKey) throw new Error('storage_not_configured');
  const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '-');
  const extension = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const path = `users/${safeUserId}/avatar-${Date.now()}.${extension}`;
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: storageHeaders(serviceRoleKey, {
      'Content-Type': contentType,
      'Content-Length': String(bytes.byteLength),
      'x-upsert': 'false',
    }),
    body: bytes as unknown as BodyInit,
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).replace(/[^a-zA-Z0-9_ .:-]/g, '').slice(0, 160);
    throw new Error(`storage_avatar_upload_failed_${response.status}${detail ? `:${detail}` : ''}`);
  }
  return { path, url: `${baseUrl}/storage/v1/object/public/${bucket}/${path}` };
}
