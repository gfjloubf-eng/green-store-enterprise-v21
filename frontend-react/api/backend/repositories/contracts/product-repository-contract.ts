import { CrudContract } from './crud-contract';
import type { PaginationOptions, PaginatedResult } from './pagination-contract';
import type { Product } from '@prisma/client';

export interface ProductRepositoryContract extends CrudContract<Product, string> {
  findBySlug(slug: string, excludeId?: string): Promise<Product | null>;
  restore(id: string): Promise<Product>;
  paginate(options: PaginationOptions): Promise<PaginatedResult<Product>>;
}
