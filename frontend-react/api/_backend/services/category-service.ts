import type { CategoryServiceContract } from './category-service-contract';
import type { CategoryRepositoryContract } from '../repositories/contracts/category-repository-contract';
import BaseService from './base-service';

export class CategoryService extends BaseService implements CategoryServiceContract {
  constructor(private readonly categoryRepo: CategoryRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.categoryRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.categoryRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.categoryRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.categoryRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.categoryRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.categoryRepo as any).paginate(options);
  }
}

export default CategoryService;