import BaseRepository from './base-repository';
import type { BranchRepositoryContract } from './contracts/branch-repository-contract';

export class BranchRepository extends BaseRepository implements BranchRepositoryContract {
  constructor() {
    super('branch');
  }
}

export default BranchRepository;
