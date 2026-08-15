import type { PaymentServiceContract } from './payment-service-contract';
import type { PaymentRepositoryContract } from '../repositories/contracts/payment-repository-contract';
import BaseService from './base-service';

export class PaymentService extends BaseService implements PaymentServiceContract {
  constructor(private readonly paymentRepo: PaymentRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.paymentRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.paymentRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.paymentRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.paymentRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.paymentRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.paymentRepo as any).paginate(options);
  }
}

export default PaymentService;
