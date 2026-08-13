import { PaginationOptions } from '../repositories/contracts/pagination-contract';

export interface PermissionServiceContract {
  create(data: unknown): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  findMany(filter?: unknown): Promise<unknown[]>;
update(id: string, data: unknown): Promise<unknown>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<unknown>;
  paginate(options: PaginationOptions): Promise<unknown>;
}
