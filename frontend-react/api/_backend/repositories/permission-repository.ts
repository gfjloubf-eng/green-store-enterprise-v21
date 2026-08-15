import BaseRepository from './base-repository';
import type { PermissionRepositoryContract } from './contracts/permission-repository-contract';

export class PermissionRepository extends BaseRepository implements PermissionRepositoryContract {
  constructor() {
    super('permission');
  }

  /**
   * The `Permission` model has no `deletedAt` column, so soft-delete is not
   * supported for this entity. DELETE falls back to a hard delete in
   * BaseRepository. Restore is therefore a no-op that returns the existing
   * record (if present) to keep the endpoint contract consistent.
   */
  async restore(id: string): Promise<unknown> {
    return this.findById(id);
  }
}

export default PermissionRepository;
