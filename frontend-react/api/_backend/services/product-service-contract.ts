import { PaginationOptions } from '../repositories/contracts/pagination-contract';
import type { PaginatedResult } from '../repositories/contracts/pagination-contract';
import type { Product } from '@prisma/client';

export interface ProductServiceContract {
  create(data: unknown): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findMany(filter?: unknown): Promise<Product[]>;
  update(id: string, data: unknown): Promise<Product>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<Product>;
  paginate(options: PaginationOptions): Promise<PaginatedResult<Product>>;
}
