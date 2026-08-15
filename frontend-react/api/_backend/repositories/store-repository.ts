import BaseRepository from './base-repository';
import type { StoreRepositoryContract } from './contracts/store-repository-contract';

export class StoreRepository extends BaseRepository implements StoreRepositoryContract {
  constructor() {
    super('store');
  }
}

export default StoreRepository;
