export interface CreateProductDto {
  sku?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  originCountry?: string | null;
  harvestDate?: string | Date | null;
  expiryDate?: string | Date | null;
  storageInstructions?: string | null;
  qualityGrade?: string | null;
  weightValue?: number | null;
  weightUnit?: string | null;
  packageLength?: number | null;
  packageWidth?: number | null;
  packageHeight?: number | null;
  shippingWeight?: number | null;
  shippingClass?: string | null;
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
  name: string;
  slug: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string };
  unit: { id: string; name: string; symbol: string | null };
  originCountry: string | null;
  harvestDate: string | null;
  expiryDate: string | null;
  storageInstructions: string | null;
  qualityGrade: string | null;
  weightValue: number | null;
  weightUnit: string | null;
  packageLength: number | null;
  packageWidth: number | null;
  packageHeight: number | null;
  shippingWeight: number | null;
  shippingClass: string | null;
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
