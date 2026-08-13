import type { RoleServiceContract } from './role-service-contract';
import type { RoleRepositoryContract } from '../repositories/contracts/role-repository-contract';
import type { PermissionRepositoryContract } from '../repositories/contracts/permission-repository-contract';
import { ConflictException, NotFoundException } from '../repositories/exceptions';
import BaseService from './base-service';

export class RoleService extends BaseService implements RoleServiceContract {
  constructor(
    private readonly roleRepo: RoleRepositoryContract,
    private readonly permissionRepo: PermissionRepositoryContract,
  ) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.roleRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.roleRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.roleRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.roleRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.roleRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.roleRepo as any).paginate(options);
  }

async restore(id: string): Promise<unknown> {
    // keep symmetry with other services; repository implements restore
    return (this.roleRepo as any).restore(id);
  }

  async listPermissions(roleId: string): Promise<unknown> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');
    const permissions = await this.roleRepo.findRolePermissions(roleId);
    return { role, permissions };
  }

  async assignPermission(roleId: string, permissionId: string): Promise<unknown> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');

    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException('permission_not_found');

    const alreadyAssigned = await this.roleRepo.hasPermission(roleId, permissionId);
    if (alreadyAssigned) throw new ConflictException('permission_already_assigned');

    try {
      return await this.roleRepo.assignPermission(roleId, permissionId);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async removePermission(roleId: string, permissionId: string): Promise<unknown> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');

    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException('permission_not_found');

    const exists = await this.roleRepo.hasPermission(roleId, permissionId);
    if (!exists) throw new NotFoundException('role_permission_not_found');

    return this.roleRepo.removePermission(roleId, permissionId);
  }

  async checkPermission(roleId: string, permissionId: string): Promise<boolean> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');

    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException('permission_not_found');

    return this.roleRepo.hasPermission(roleId, permissionId);
  }
}

export default RoleService;
