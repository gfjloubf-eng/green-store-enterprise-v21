import type { SupplierServiceContract } from './supplier-service-contract';
import type { SupplierRepositoryContract } from '../repositories/contracts/supplier-repository-contract';
import BaseService from './base-service';

export class SupplierService extends BaseService implements SupplierServiceContract {
  constructor(private readonly supplierRepo: SupplierRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.supplierRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.supplierRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.supplierRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.supplierRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.supplierRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return this.supplierRepo.paginate(options);
  }
}

export default SupplierService;