import type { ProductDTO } from '@/features/products/domain/productDTO';

const CACHE_KEY = 'qutoof_public_catalog_v1';
const CACHE_TTL_MS = 10 * 60 * 1000;

type CachePayload = {
  savedAt: number;
  products: ProductDTO[];
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readPublicCatalogCache(): ProductDTO[] | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as CachePayload;
    if (!payload || !Array.isArray(payload.products) || typeof payload.savedAt !== 'number') {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }
    if (Date.now() - payload.savedAt > CACHE_TTL_MS) return null;
    return payload.products;
  } catch {
    return null;
  }
}

export function writePublicCatalogCache(products: ProductDTO[]): void {
  if (!canUseStorage() || !Array.isArray(products) || products.length === 0) return;
  try {
    const payload: CachePayload = { savedAt: Date.now(), products };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Cache is optional; never interrupt normal product loading.
  }
}

export function clearPublicCatalogCache(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage restrictions.
  }
}
