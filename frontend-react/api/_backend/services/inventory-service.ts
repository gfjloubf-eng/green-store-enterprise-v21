import type { InventoryServiceContract } from './inventory-service-contract';
import type { InventoryRepositoryContract } from '../repositories/contracts/inventory-repository-contract';
import BaseService from './base-service';

export class InventoryService extends BaseService implements InventoryServiceContract {
  constructor(private readonly inventoryRepo: InventoryRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.inventoryRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.inventoryRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.inventoryRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.inventoryRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.inventoryRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.inventoryRepo as any).paginate(options);
  }
}

export default InventoryService;