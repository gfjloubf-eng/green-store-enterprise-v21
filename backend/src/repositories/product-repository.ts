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
    return ((await this.model.findFirst({
      where: { id, deletedAt: null },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    })) as Product | null) ?? null;
  }

  async findBySlug(slug: string, excludeId?: string): Promise<Product | null> {
    const where = excludeId
      ? { slug, id: { not: excludeId }, deletedAt: null }
      : { slug, deletedAt: null };
    return ((await this.model.findFirst({ where })) as Product | null) ?? null;
  }

  async create(data: Partial<Product>): Promise<Product> {
    const { imageUrl, imageAltText, ...productData } = data as Partial<Product> & Record<string, unknown>;
    const created = await this.model.create({
      data: productData,
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (typeof imageUrl === 'string' && imageUrl.trim()) {
      await this.client.productImage.create({
        data: {
          productId: created.id,
          url: imageUrl.trim(),
          altText: typeof imageAltText === 'string' && imageAltText.trim() ? imageAltText.trim() : `${created.name} - قطوف الطبيعة`,
          sortOrder: 0,
        },
      });
    }
    return this.findById(created.id) as Promise<Product>;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const hasImageUpdate = Object.prototype.hasOwnProperty.call(data, 'imageUrl');
    const { imageUrl, imageAltText, ...productData } = data as Partial<Product> & Record<string, unknown>;
    const updated = await this.model.update({
      where: { id },
      data: productData,
    });
    if (hasImageUpdate) {
      await this.client.productImage.deleteMany({ where: { productId: id } });
      if (typeof imageUrl === 'string' && imageUrl.trim()) {
        await this.client.productImage.create({
          data: {
            productId: id,
            url: imageUrl.trim(),
            altText: typeof imageAltText === 'string' && imageAltText.trim() ? imageAltText.trim() : `${updated.name} - قطوف الطبيعة`,
            sortOrder: 0,
          },
        });
      }
    }
    return this.findById(id) as Promise<Product>;
  }

  async findMany(filter?: Filter): Promise<Product[]> {
    return this.model.findMany({
      where: { AND: [{ deletedAt: null }, filter ?? {}] },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
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
