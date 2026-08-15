import BaseRepository from './base-repository';
import type { ProductRepositoryContract } from './contracts/product-repository-contract';
import type { Filter } from './contracts/filtering-contract';
import type { PaginationOptions, PaginatedResult } from './contracts/pagination-contract';
import type { Product } from '@prisma/client';

export class ProductRepository extends BaseRepository implements ProductRepositoryContract {
  constructor() {
    super('product');
  }

  async findById(id: string): Promise<Product | null> {
    return ((await this.model.findFirst({ where: { id, deletedAt: null } })) as Product | null) ?? null;
  }

  async findBySlug(slug: string, excludeId?: string): Promise<Product | null> {
    const where = excludeId
      ? { slug, id: { not: excludeId }, deletedAt: null }
      : { slug, deletedAt: null };
    return ((await this.model.findFirst({ where })) as Product | null) ?? null;
  }

  async create(data: Partial<Product>): Promise<Product> {
    return this.model.create({ data }) as Promise<Product>;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return this.model.update({ where: { id }, data }) as Promise<Product>;
  }

  async findMany(filter?: Filter): Promise<Product[]> {
    return this.model.findMany({
      where: { AND: [{ deletedAt: null }, filter ?? {}] },
    }) as Promise<Product[]>;
  }

  async delete(id: string): Promise<void> {
    await this.model.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async restore(id: string): Promise<Product> {
    return this.model.update({ where: { id }, data: { deletedAt: null } }) as Promise<Product>;
  }

  async paginate(options: PaginationOptions): Promise<PaginatedResult<Product>> {
    const filters = options.filters && Object.keys(options.filters).length > 0
      ? { AND: [{ deletedAt: null }, options.filters] }
      : { deletedAt: null };

    return super.paginate({ ...options, filters }) as Promise<PaginatedResult<Product>>;
  }
}

export default ProductRepository;
