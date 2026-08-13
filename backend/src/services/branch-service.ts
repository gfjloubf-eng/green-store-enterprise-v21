import type { BranchServiceContract } from './branch-service-contract';
import type { BranchRepositoryContract } from '../repositories/contracts/branch-repository-contract';
import BaseService from './base-service';

export class BranchService extends BaseService implements BranchServiceContract {
  constructor(private readonly branchRepo: BranchRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.branchRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.branchRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.branchRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.branchRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.branchRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.branchRepo as any).paginate(options);
  }
}

export default BranchService;