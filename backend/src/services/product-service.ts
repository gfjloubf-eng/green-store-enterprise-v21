import type { ProductServiceContract } from './product-service-contract';
import type { ProductRepositoryContract } from '../repositories/contracts/product-repository-contract';
import BaseService from './base-service';
import { ConflictException, NotFoundException } from '../repositories/exceptions';
import { ValidationException } from '../validation';
import type { Filter } from '../repositories/contracts/filtering-contract';
import type { PaginationOptions } from '../repositories/contracts/pagination-contract';
import type { Product } from '@prisma/client';

export class ProductService extends BaseService implements ProductServiceContract {
  constructor(private readonly productRepo: ProductRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<Product> {
    await this.validateCreate(data);
    try {
      return await this.productRepo.create(this.toPersistencePayload(data as Record<string, unknown>) as Partial<Product>);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<Product[]> {
    return this.productRepo.findMany(filter as Filter | undefined);
  }

  async update(id: string, data: unknown): Promise<Product> {
    await this.validateUpdate(id, data);
    try {
      return await this.productRepo.update(id, this.toPersistencePayload(data as Record<string, unknown>, true) as Partial<Product>);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.productRepo.delete(id);
  }

  async paginate(options: PaginationOptions) {
    return this.productRepo.paginate(options);
  }

  async restore(id: string): Promise<Product> {
    if (!id) throw new ValidationException('id_required');
    try {
      return await this.productRepo.restore(id);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  protected async validateCreate(data: unknown): Promise<void> {
    if (!data || typeof data !== 'object') throw new ValidationException('data_required');
    const payload = data as Record<string, unknown>;
    if (typeof payload.name !== 'string' || !payload.name.trim()) throw new ValidationException('name_required');
    if (typeof payload.slug !== 'string' || !payload.slug.trim()) throw new ValidationException('slug_required');
    this.validateOptionalFields(payload);
    if (await this.productRepo.findBySlug(payload.slug.trim())) throw new ConflictException('product_slug_exists');
  }

  protected async validateUpdate(id: string, data: unknown): Promise<void> {
    if (!id) throw new ValidationException('id_required');
    if (!data || typeof data !== 'object') throw new ValidationException('data_required');
    if (!(await this.productRepo.findById(id))) throw new NotFoundException('product_not_found');
    this.validateOptionalFields(data as Record<string, unknown>, true);
    const payload = data as Record<string, unknown>;
    if (typeof payload.slug === 'string' && await this.productRepo.findBySlug(payload.slug.trim(), id)) {
      throw new ConflictException('product_slug_exists');
    }
  }

  protected async validateDelete(id: string): Promise<void> {
    if (!id) throw new ValidationException('id_required');
    if (!(await this.productRepo.findById(id))) throw new NotFoundException('product_not_found');
  }

  private validateOptionalFields(payload: Record<string, unknown>, update = false): void {
    const stringFields = ['sku', 'barcode', 'name', 'slug', 'description', 'brandId', 'unitId', 'categoryId', 'subcategoryId', 'produceKey', 'familyId', 'imageUrl', 'imageAltText'];
    const maxLengths: Record<string, number> = {
      sku: 100,
      barcode: 32,
      name: 255,
      slug: 255,
      description: 5000,
      brandId: 36,
      unitId: 36,
      categoryId: 36,
      subcategoryId: 36,
      produceKey: 120,
      familyId: 36,
      imageUrl: 450000,
      imageAltText: 255,
    };
    for (const field of stringFields) {
      if (payload[field] !== undefined && payload[field] !== null && typeof payload[field] !== 'string') {
        throw new ValidationException(`${field}_invalid`);
      }
      if (typeof payload[field] === 'string') {
        if (!payload[field].trim()) throw new ValidationException(`${field}_required`);
        if (payload[field].trim().length > maxLengths[field]) throw new ValidationException(`${field}_too_long`);
      }
    }
    if (typeof payload.slug === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug.trim())) {
      throw new ValidationException('slug_invalid');
    }
    for (const field of ['brandId', 'unitId', 'categoryId', 'subcategoryId']) {
      if (typeof payload[field] === 'string' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload[field].trim())) {
        throw new ValidationException(`${field}_invalid`);
      }
    }
    if (payload.isPublished !== undefined && typeof payload.isPublished !== 'boolean') {
      throw new ValidationException('isPublished_invalid');
    }
    if (typeof payload.imageUrl === 'string' && payload.imageUrl.trim()) {
      const imageUrl = payload.imageUrl.trim();
      const isAllowedImage = /^(https?:\/\/|data:image\/(?:jpeg|jpg|png|webp);base64,)/i.test(imageUrl);
      if (!isAllowedImage) throw new ValidationException('imageUrl_invalid');
      if (imageUrl.length > maxLengths.imageUrl) throw new ValidationException('imageUrl_too_large');
    }
    if (update && !stringFields.some((field) => payload[field] !== undefined) && payload.isPublished === undefined) {
      throw new ValidationException('data_required');
    }
  }

  private toPersistencePayload(payload: Record<string, unknown>, update = false): Record<string, unknown> {
    const fields = ['sku', 'barcode', 'produceKey', 'familyId', 'name', 'slug', 'description', 'brandId', 'unitId', 'categoryId', 'subcategoryId', 'imageUrl', 'imageAltText', 'isPublished'];
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      if (payload[field] !== undefined) {
        result[field] = typeof payload[field] === 'string' ? payload[field].trim() : payload[field];
      }
    }
    if (!update && result.isPublished === undefined) result.isPublished = false;
    return result;
  }
}

export default ProductService;