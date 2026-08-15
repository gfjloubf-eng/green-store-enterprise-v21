import type { StoreServiceContract } from './store-service-contract';
import type { StoreRepositoryContract } from '../repositories/contracts/store-repository-contract';
import BaseService from './base-service';

export class StoreService extends BaseService implements StoreServiceContract {
  constructor(private readonly storeRepo: StoreRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.storeRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.storeRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.storeRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.storeRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.storeRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return this.storeRepo.paginate(options);
  }
}

export default StoreService;