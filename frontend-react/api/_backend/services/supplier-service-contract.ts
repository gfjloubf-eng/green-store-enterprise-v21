import { PaginationOptions } from '../repositories/contracts/pagination-contract';

export interface SupplierServiceContract {
  create(data: unknown): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  findMany(filter?: unknown): Promise<unknown[]>;
  update(id: string, data: unknown): Promise<unknown>;
  delete(id: string): Promise<void>;
  paginate(options: PaginationOptions): Promise<unknown>;
}
