import { CrudContract } from './crud-contract';

export interface RoleRepositoryContract extends CrudContract<unknown, string> {
  findRolePermissions(roleId: string): Promise<unknown[]>;
  assignPermission(roleId: string, permissionId: string): Promise<unknown>;
  removePermission(roleId: string, permissionId: string): Promise<unknown>;
  hasPermission(roleId: string, permissionId: string): Promise<boolean>;
}
