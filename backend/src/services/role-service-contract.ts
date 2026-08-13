import { PaginationOptions } from '../repositories/contracts/pagination-contract';

export interface RoleServiceContract {
  create(data: unknown): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  findMany(filter?: unknown): Promise<unknown[]>;
  update(id: string, data: unknown): Promise<unknown>;
  delete(id: string): Promise<void>;
  paginate(options: PaginationOptions): Promise<unknown>;
  listPermissions(roleId: string): Promise<unknown>;
  assignPermission(roleId: string, permissionId: string): Promise<unknown>;
  removePermission(roleId: string, permissionId: string): Promise<unknown>;
  checkPermission(roleId: string, permissionId: string): Promise<boolean>;
}
