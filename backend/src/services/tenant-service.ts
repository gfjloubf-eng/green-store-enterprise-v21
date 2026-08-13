import type { TenantServiceContract } from './tenant-service-contract';
import type { TenantRepositoryContract } from '../repositories/contracts/tenant-repository-contract';
import BaseService from './base-service';

export class TenantService extends BaseService implements TenantServiceContract {
  constructor(private readonly tenantRepo: TenantRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.tenantRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.tenantRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.tenantRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.tenantRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.tenantRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return this.tenantRepo.paginate(options);
  }
}

export default TenantService;
