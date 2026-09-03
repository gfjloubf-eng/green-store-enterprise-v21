import type { Cart as GatewayCart, CartItem as GatewayCartItem } from '@/services/cartClient';

/**
 * Marketplace cart types.
 * The gateway (cartClient) is the single storage/operations layer; these
 * types mirror its customer-facing shapes so React surfaces share one source.
 */
export type CartItem = GatewayCartItem;
export type Cart = GatewayCart;

/** Unified totals shown identically on the drawer, /cart and checkout. */
export interface CartTotals {
  subtotal: number;
  /** savings = original − final when an offer is active (informational). */
  savings: number;
  /** 15% of subtotal. */
  taxTotal: number;
  /** 3 YER once for a non-empty cart, else 0. */
  deliveryTotal: number;
  grandTotal: number;
  totalQuantity: number;
}
