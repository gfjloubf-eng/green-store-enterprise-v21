export interface CreateProductDto {
  sku?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  brandId?: string | null;
  unitId?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  isPublished?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductResponseDto {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  brandId: string | null;
  unitId: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
