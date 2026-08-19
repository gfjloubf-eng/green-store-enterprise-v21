import prismaClientPackage from '@prisma/client';
import { ConflictException, NotFoundException, DatabaseException } from './exceptions';

const { Prisma } = prismaClientPackage;

export function mapPrismaError(err: any): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        // Unique constraint failed
        throw new ConflictException(err.message);
      case 'P2025':
        // Record to update/delete does not exist
        throw new NotFoundException(err.message);
      case 'P2003':
        // Foreign key constraint failed
        throw new DatabaseException(err.message);
      default:
        throw new DatabaseException(err.message);
    }
  }

  // If it's not a Prisma known request error, rethrow as DatabaseException to avoid leaking details
  if (err instanceof Error) {
    throw new DatabaseException(err.message);
  }

  throw new DatabaseException('Unknown database error');
}
