/* ============================================================
   GSDS v1.2 — OfferService & Price Safety Engine
   Green Store Enterprise v2 — Premium Offers
   ============================================================ */

import type { ProductOffer } from '../types/product';
import type { ProductDTO } from '../domain/productDTO';
import { ProductService } from './productService';
import { isAuthorizedStaffOrAdmin, getApiBase, parseJsonSafe } from '@/services/authClient';

export interface CalculatedPrice {
  /** Effective final selling price */
  finalPrice: number;
  /** Original price before discount */
  originalPrice: number;
  /** Whether an active offer or discount is applied */
  hasActiveOffer: boolean;
  /** Percentage saved (e.g. 20 for 20%) */
  discountPercentage: number;
  /** Optional title of the offer (e.g. عرض اليوم) */
  offerTitle?: string;
  /** Offer type badge identifier */
  offerType?: string;
}

export type OfferStateStatus = 'active' | 'upcoming' | 'expired' | 'disabled';

export function getOfferStateStatus(offer: ProductOffer): OfferStateStatus {
  if (!offer.active) return 'disabled';
  const now = Date.now();
  if (offer.startDate) {
    const start = new Date(offer.startDate).getTime();
    if (!isNaN(start) && start > now) return 'upcoming';
  }
  if (offer.endDate) {
    const end = new Date(offer.endDate).getTime();
    if (!isNaN(end) && end < now) return 'expired';
  }
  return 'active';
}

/**
 * Price Safety Calculator.
 * Guarantees:
 * - Final price is never negative.
 * - Inactive, upcoming, or expired offers fallback to original retail price.
 * - Strikethrough price is always strictly greater than final price.
 */
export function calculateEffectivePrice(product: {
  sellingPrice: number;
  compareAtPrice?: number;
  offer?: ProductOffer;
}): CalculatedPrice {
  const basePrice = Math.max(0.01, product.sellingPrice || 0);

  if (product.offer && product.offer.active) {
    // Start & Expiration check
    if (product.offer.startDate) {
      const start = new Date(product.offer.startDate).getTime();
      if (!isNaN(start) && start > Date.now()) {
        return {
          finalPrice: basePrice,
          originalPrice: basePrice,
          hasActiveOffer: false,
          discountPercentage: 0,
        };
      }
    }

    if (product.offer.endDate) {
      const end = new Date(product.offer.endDate).getTime();
      if (!isNaN(end) && end < Date.now()) {
        return {
          finalPrice: basePrice,
          originalPrice: basePrice,
          hasActiveOffer: false,
          discountPercentage: 0,
        };
      }
    }

    const origPrice = Math.max(
      basePrice,
      product.offer.originalPrice || product.compareAtPrice || basePrice,
    );

    let finalPrice = product.offer.offerPrice;
    if (!finalPrice || finalPrice <= 0 || finalPrice >= origPrice) {
      if (product.offer.type === 'percentage' && product.offer.discountValue > 0) {
        finalPrice = Math.max(0.01, origPrice * (1 - product.offer.discountValue / 100));
      } else if (product.offer.type === 'fixed' && product.offer.discountValue > 0) {
        finalPrice = Math.max(0.01, origPrice - product.offer.discountValue);
      } else {
        finalPrice = basePrice;
      }
    }

    // Rounding & safety check
    finalPrice = Math.round(finalPrice * 100) / 100;
    const isOfferValid = finalPrice < origPrice && finalPrice > 0;

    if (isOfferValid) {
      const pct = Math.round(((origPrice - finalPrice) / origPrice) * 100);
      return {
        finalPrice,
        originalPrice: origPrice,
        hasActiveOffer: true,
        discountPercentage: Math.max(1, pct),
        offerTitle: product.offer.title || 'عرض خاص',
        offerType: product.offer.type,
      };
    }
  }

  // Fallback: compareAtPrice discount without explicit offer entity
  if (product.compareAtPrice && product.compareAtPrice > basePrice) {
    const origPrice = Math.round(product.compareAtPrice * 100) / 100;
    const pct = Math.round(((origPrice - basePrice) / origPrice) * 100);
    return {
      finalPrice: basePrice,
      originalPrice: origPrice,
      hasActiveOffer: true,
      discountPercentage: Math.max(1, pct),
      offerTitle: 'خصم مميز',
      offerType: 'percentage',
    };
  }

  return {
    finalPrice: basePrice,
    originalPrice: basePrice,
    hasActiveOffer: false,
    discountPercentage: 0,
  };
}

export const OfferService = {
  /**
   * Get all active offers across all products.
   * Dynamically triggers background backend sync with local fallback.
   */
  getActiveOffers(): ProductDTO[] {
    this.syncOffersFromBackendApi().catch(() => {});
    const products = ProductService.getAll();
    return products.filter((p) => {
      if (p.status !== 'active') return false;
      const calc = calculateEffectivePrice(p);
      return calc.hasActiveOffer;
    });
  },

  /**
   * Async fetch offers from Backend API with safe fallback to local state.
   */
  async syncOffersFromBackendApi(): Promise<ProductDTO[]> {
    try {
      const res = await fetch(`${getApiBase()}/offers`);
      if (res.ok) {
        const payload = await parseJsonSafe(res);
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : null);
        if (list && list.length > 0) {
          for (const offerData of list) {
            const prodId = offerData.productId || offerData.id;
            if (prodId && offerData.offer) {
              const product = ProductService.getById(prodId);
              if (product) {
                const updatedOffer: ProductOffer = {
                  id: String(offerData.offer.id || offerData.id || `offer-${prodId}`),
                  title: String(offerData.offer.title || offerData.title || 'عرض خاص'),
                  discountValue: Number(offerData.offer.discountValue || offerData.discountValue || 0),
                  type: offerData.offer.type === 'fixed' ? 'fixed' : 'percentage',
                  originalPrice: Number(offerData.offer.originalPrice || product.compareAtPrice || product.sellingPrice),
                  offerPrice: Number(offerData.offer.offerPrice || product.sellingPrice),
                  startDate: offerData.offer.startDate || offerData.startDate,
                  endDate: offerData.offer.endDate || offerData.endDate,
                  active: offerData.offer.active !== undefined ? Boolean(offerData.offer.active) : true,
                };
                ProductService.update(prodId, { offer: updatedOffer });
              }
            }
          }
        }
      }
    } catch {
      // Safe fallback: Local offer logic remains active
    }
    return this.getActiveOffers();
  },

  /**
   * Get calculated price safety details for a product.
   */
  getPriceDetails(product: { sellingPrice: number; compareAtPrice?: number; offer?: ProductOffer }): CalculatedPrice {
    return calculateEffectivePrice(product);
  },

  /**
   * Attach or update an offer on a product (Admin function).
   */
  setProductOffer(productId: string, offer: ProductOffer): ProductDTO | undefined {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: إدارة العروض تتطلب صلاحيات إدارية');
    }
    const calc = calculateEffectivePrice({
      sellingPrice: offer.originalPrice,
      compareAtPrice: offer.originalPrice,
      offer,
    });

    const updatedOffer: ProductOffer = {
      ...offer,
      offerPrice: calc.finalPrice,
      originalPrice: calc.originalPrice,
    };

    return ProductService.update(productId, {
      offer: updatedOffer,
      compareAtPrice: offer.originalPrice,
      discount: calc.discountPercentage,
    });
  },

  /**
   * Toggle offer active state (Admin function).
   */
  toggleOfferState(productId: string, active: boolean): ProductDTO | undefined {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: إدارة العروض تتطلب صلاحيات إدارية');
    }
    const product = ProductService.getById(productId);
    if (!product || !product.offer) return undefined;

    const updatedOffer = { ...product.offer, active };
    return ProductService.update(productId, { offer: updatedOffer });
  },

  /**
   * Remove offer from product (Admin function).
   */
  removeOffer(productId: string): ProductDTO | undefined {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: إدارة العروض تتطلب صلاحيات إدارية');
    }
    return ProductService.update(productId, { offer: undefined, compareAtPrice: undefined, discount: 0 });
  },
};
