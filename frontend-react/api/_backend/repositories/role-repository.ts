import BaseRepository from './base-repository';
import type { RoleRepositoryContract } from './contracts/role-repository-contract';

export class RoleRepository extends BaseRepository implements RoleRepositoryContract {
  constructor() {
    super('role');
  }

  /**
   * Persistence-only operations for the implicit Role ↔ Permission join
   * (RolePermission / role_permissions). Business rules live in the service.
   */

  async findRolePermissions(roleId: string): Promise<unknown[]> {
    const role = await this.model.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } },
    });
    if (!role) return [];
    return (role.permissions as any[]) ?? [];
  }

  async assignPermission(roleId: string, permissionId: string): Promise<unknown> {
    return this.client.rolePermission.create({
      data: { roleId, permissionId },
      include: { permission: true },
    });
  }

  async removePermission(roleId: string, permissionId: string): Promise<unknown> {
    const existing = await this.client.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
    if (!existing) return null;
    return this.client.rolePermission.delete({
      where: { id: existing.id },
    });
  }

  async hasPermission(roleId: string, permissionId: string): Promise<boolean> {
    const count = await this.client.rolePermission.count({
      where: { roleId, permissionId },
    });
    return count > 0;
  }
}

export default RoleRepository;
