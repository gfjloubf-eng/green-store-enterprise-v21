export interface AddToCartDto {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemResponseDto {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: {
    id: string;
    name: string;
    sku?: string | null;
  } | null;
  createdAt: string;
}

export interface CartResponseDto {
  id: string;
  customerId: string;
  items: CartItemResponseDto[];
  subtotal: number;
  totalQuantity: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
