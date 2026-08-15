import type { OrderServiceContract } from './order-service-contract';
import type { OrderRepositoryContract } from '../repositories/contracts/order-repository-contract';
import BaseService from './base-service';

export class OrderService extends BaseService implements OrderServiceContract {
  constructor(private readonly orderRepo: OrderRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.orderRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.orderRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.orderRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.orderRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.orderRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.orderRepo as any).paginate(options);
  }
}

export default OrderService;