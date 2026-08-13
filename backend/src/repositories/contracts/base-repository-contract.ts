export interface BaseRepositoryContract<T, ID = string> {
  findById(id: ID, opts?: any): Promise<T | null>;
  findMany(opts?: any): Promise<T[]>;
  create(data: Partial<T>, opts?: any): Promise<T>;
  update(id: ID, data: Partial<T>, opts?: any): Promise<T>;
  delete(id: ID, opts?: any): Promise<void>;
  restore(id: ID, opts?: any): Promise<void>;
  exists(where: any): Promise<boolean>;
  count(where?: any): Promise<number>;
}
