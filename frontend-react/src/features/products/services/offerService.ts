/* ============================================================
   GSDS v1.2 — OfferService & Price Safety Engine
   Green Store Enterprise v2 — Premium Offers
   ============================================================ */

import type { ProductOffer } from '../types/product';
import type { ProductDTO } from '../domain/productDTO';
import { ProductService } from './productService';

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

/**
 * Price Safety Calculator.
 * Guarantees:
 * - Final price is never negative.
 * - Inactive or expired offers fallback to original retail price.
 * - Strikethrough price is always strictly greater than final price.
 */
export function calculateEffectivePrice(product: {
  sellingPrice: number;
  compareAtPrice?: number;
  offer?: ProductOffer;
}): CalculatedPrice {
  const basePrice = Math.max(0.01, product.sellingPrice || 0);

  if (product.offer && product.offer.active) {
    // Expiration check
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
   */
  getActiveOffers(): ProductDTO[] {
    const products = ProductService.getAll();
    return products.filter((p) => {
      if (p.status !== 'active') return false;
      const calc = calculateEffectivePrice(p);
      return calc.hasActiveOffer;
    });
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
    const product = ProductService.getById(productId);
    if (!product || !product.offer) return undefined;

    const updatedOffer = { ...product.offer, active };
    return ProductService.update(productId, { offer: updatedOffer });
  },

  /**
   * Remove offer from product (Admin function).
   */
  removeOffer(productId: string): ProductDTO | undefined {
    return ProductService.update(productId, { offer: undefined, compareAtPrice: undefined, discount: 0 });
  },
};
