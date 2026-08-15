import BaseRepository from './base-repository';
import type { CategoryRepositoryContract } from './contracts/category-repository-contract';

export class CategoryRepository extends BaseRepository implements CategoryRepositoryContract {
  constructor() {
    super('category');
  }
}

export default CategoryRepository;
