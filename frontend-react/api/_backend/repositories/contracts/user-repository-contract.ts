import { CrudContract } from './crud-contract';

export interface UserRepositoryContract extends CrudContract<unknown, string> {
  restore(id: string): Promise<unknown>;
}
