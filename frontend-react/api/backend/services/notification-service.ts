import type { NotificationServiceContract } from './notification-service-contract';
import type { NotificationRepositoryContract } from '../repositories/contracts/notification-repository-contract';
import BaseService from './base-service';

export class NotificationService extends BaseService implements NotificationServiceContract {
  constructor(private readonly notificationRepo: NotificationRepositoryContract) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.notificationRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.notificationRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.notificationRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.notificationRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.notificationRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return (this.notificationRepo as any).paginate(options);
  }
}

export default NotificationService;