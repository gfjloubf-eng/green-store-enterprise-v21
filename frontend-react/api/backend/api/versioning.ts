export type ApiVersion = 'v1';

export interface ApiVersionInfo {
  readonly version: ApiVersion;
  readonly isSupported: boolean;
}

export function resolveApiVersion(version?: string): ApiVersionInfo {
  const normalized = version?.toLowerCase();
  if (normalized === 'v1') {
    return { version: 'v1', isSupported: true };
  }

  return { version: 'v1', isSupported: false };
}
