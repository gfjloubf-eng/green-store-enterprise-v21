import BaseRepository from './base-repository';
import type { SupplierRepositoryContract } from './contracts/supplier-repository-contract';

export class SupplierRepository extends BaseRepository implements SupplierRepositoryContract {
  constructor() {
    super('supplier');
  }
}

export default SupplierRepository;
