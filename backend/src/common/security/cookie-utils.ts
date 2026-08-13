export function buildSecureCookie(name: string, value: string, maxAgeSeconds: number, opts?: { httpOnly?: boolean; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None'; path?: string; domain?: string }) {
  const parts = [] as string[];
  parts.push(`${name}=${encodeURIComponent(value)}`);
  parts.push(`Max-Age=${Math.floor(maxAgeSeconds)}`);
  parts.push(`Path=${opts?.path ?? '/'}`);
  if (opts?.domain) parts.push(`Domain=${opts.domain}`);
  parts.push(`HttpOnly=${opts?.httpOnly === false ? 'false' : 'true'}`);
  // Secure must be true in production when using https
  parts.push(`Secure=${opts?.secure === false ? 'false' : 'true'}`);
  parts.push(`SameSite=${opts?.sameSite ?? 'Strict'}`);
  return parts.join('; ');
}

export function clearCookie(name: string, opts?: { path?: string; domain?: string }) {
  const parts = [`${name}=; Max-Age=0`, `Path=${opts?.path ?? '/'}`];
  if (opts?.domain) parts.push(`Domain=${opts.domain}`);
  parts.push('HttpOnly=true', 'Secure=true', 'SameSite=Strict');
  return parts.join('; ');
}