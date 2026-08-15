import { PaginationOptions, PaginatedResult } from './pagination-contract';

export interface CrudContract<T, ID = string> {
  create(data: Partial<T>): Promise<T>;
  findById(id: ID): Promise<T | null>;
  findMany(filter?: any): Promise<T[]>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
  paginate(options: PaginationOptions): Promise<PaginatedResult<T>>;
}
