export interface CreateProductDto {
  sku?: string | null;
  produceKey?: string | null;
  familyId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  brandId?: string | null;
  unitId?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  imageUrl?: string | null;
  imageAltText?: string | null;
  isPublished?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductImageResponseDto {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface ProductResponseDto {
  id: string;
  sku: string | null;
  produceKey: string | null;
  familyId: string | null;
  name: string;
  slug: string;
  description: string | null;
  brandId: string | null;
  unitId: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  imageUrl: string | null;
  imageAltText: string | null;
  images: ProductImageResponseDto[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
