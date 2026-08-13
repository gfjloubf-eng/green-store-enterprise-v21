import type { AuditServiceContract } from './audit-service-contract';
import type { AuditRepositoryContract } from '../repositories/contracts/audit-repository-contract';
import BaseService from './base-service';

export class AuditService extends BaseService implements AuditServiceContract {
  constructor(private readonly auditRepo: AuditRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.auditRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.auditRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.auditRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.auditRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.auditRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.auditRepo as any).paginate(options);
  }
}

export default AuditService;