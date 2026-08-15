import type { UserServiceContract } from './user-service-contract';
import type { UserRepositoryContract } from '../repositories/contracts/user-repository-contract';
import type { RoleRepositoryContract } from '../repositories/contracts/role-repository-contract';
import BaseService from './base-service';
import { ConflictException, NotFoundException } from '../repositories/exceptions';

export class UserService extends BaseService implements UserServiceContract {
  constructor(
    private readonly userRepo: UserRepositoryContract,
    private readonly roleRepo?: RoleRepositoryContract,
  ) {
    super();
  }

  async create(data: unknown): Promise<unknown> {
    await this.validateCreate(data);
    try {
      return await this.userRepo.create(data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string): Promise<unknown | null> {
    return this.userRepo.findById(id);
  }

  async findMany(filter?: unknown): Promise<unknown[]> {
    return this.userRepo.findMany(filter as any);
  }

  async update(id: string, data: unknown): Promise<unknown> {
    await this.validateUpdate(id, data);
    try {
      return await this.userRepo.update(id, data as any);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    await this.validateDelete(id);
    await this.userRepo.delete(id);
  }

  async paginate(options: any): Promise<unknown> {
    return this.userRepo.paginate(options);
  }

  async restore(id: string): Promise<unknown> {
    // no validation hook by default, but keep symmetry
    // call repository restore (BaseRepository implements it)
    // Type cast because contract may not expose restore explicitly on repo
    return (this.userRepo as any).restore(id);
  }

  async listRoles(userId: string): Promise<unknown> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('user_not_found');
    const roles = await (this.userRepo as UserRepositoryContract & {
      findUserRoles(id: string): Promise<unknown[]>;
    }).findUserRoles(userId);
    return { userId, roles };
  }

  async assignRole(userId: string, roleId: string): Promise<unknown> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('user_not_found');
    if (!this.roleRepo) throw new Error('role_repository_not_configured');
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');

    const repository = this.userRepo as UserRepositoryContract & {
      hasRole(id: string, assignedRoleId: string): Promise<boolean>;
      assignRole(id: string, assignedRoleId: string): Promise<unknown>;
    };
    if (await repository.hasRole(userId, roleId)) {
      throw new ConflictException('role_already_assigned');
    }

    try {
      return await repository.assignRole(userId, roleId);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async removeRole(userId: string, roleId: string): Promise<unknown> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('user_not_found');
    if (!this.roleRepo) throw new Error('role_repository_not_configured');
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');

    const repository = this.userRepo as UserRepositoryContract & {
      hasRole(id: string, assignedRoleId: string): Promise<boolean>;
      removeRole(id: string, assignedRoleId: string): Promise<unknown>;
    };
    if (!(await repository.hasRole(userId, roleId))) {
      throw new NotFoundException('user_role_not_found');
    }
    return repository.removeRole(userId, roleId);
  }

  async checkRole(userId: string, roleId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('user_not_found');
    if (!this.roleRepo) throw new Error('role_repository_not_configured');
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('role_not_found');
    return (this.userRepo as UserRepositoryContract & {
      hasRole(id: string, assignedRoleId: string): Promise<boolean>;
    }).hasRole(userId, roleId);
  }
}

export default UserService;
