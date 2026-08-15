import type { PermissionServiceContract } from './permission-service-contract';
import type { PermissionRepositoryContract } from '../repositories/contracts/permission-repository-contract';
import BaseService from './base-service';

export class PermissionService extends BaseService implements PermissionServiceContract {
  constructor(private readonly permissionRepo: PermissionRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.permissionRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.permissionRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.permissionRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.permissionRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.permissionRepo.delete(id);
  }

  async restore(id: string): Promise<unknown> {
    // repair symmetry with the base repository restore behavior
    return (this.permissionRepo as any).restore(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.permissionRepo as any).paginate(options);
  }
}

export default PermissionService;