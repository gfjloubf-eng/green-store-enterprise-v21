export type ApiContentType = 'application/json';

export interface ContentNegotiationOptions {
  readonly supportedTypes: readonly ApiContentType[];
}

export interface ContentNegotiationResult {
  readonly accepted: boolean;
  readonly contentType: ApiContentType;
}

export function negotiateContentType(acceptHeader?: string, options: ContentNegotiationOptions = { supportedTypes: ['application/json'] }): ContentNegotiationResult {
  if (!acceptHeader) {
    return { accepted: true, contentType: 'application/json' };
  }

  const normalized = acceptHeader.toLowerCase();
  if (normalized.includes('application/json')) {
    return { accepted: true, contentType: 'application/json' };
  }

  return { accepted: false, contentType: 'application/json' };
}
