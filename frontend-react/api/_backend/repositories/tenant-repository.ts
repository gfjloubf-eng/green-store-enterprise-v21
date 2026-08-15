import BaseRepository from './base-repository';
import type { TenantRepositoryContract } from './contracts/tenant-repository-contract';

export class TenantRepository extends BaseRepository implements TenantRepositoryContract {
  constructor() {
    super('tenant');
  }
}

export default TenantRepository;
