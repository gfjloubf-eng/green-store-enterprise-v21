import { logger as repoLogger } from '../repositories/logger';
import PrismaService from '../repositories/prisma-service';
import { mapPrismaError } from '../repositories/prisma-error-mapper';

export abstract class BaseService {
  protected readonly logger = repoLogger;

  protected constructor() {}

  // Validation hooks (override in concrete services)
  protected async validateCreate(_data: unknown): Promise<void> {}
  protected async validateUpdate(_id: string, _data: unknown): Promise<void> {}
  protected async validateDelete(_id: string): Promise<void> {}

  // Transaction helper
  protected async runInTransaction<T>(work: (tx: typeof PrismaService['getClient'] extends () => infer R ? R : unknown) => Promise<T>): Promise<T> {
    try {
      return await PrismaService.transaction(async (tx) => work(tx as any));
    } catch (err) {
      mapPrismaError(err);
    }
  }

  // Generic error wrapper to map Prisma errors
  protected handleRepoError(err: unknown): never {
    mapPrismaError(err);
  }
}

export default BaseService;
