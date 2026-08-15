import BaseRepository from './base-repository';
import type { UserRepositoryContract } from './contracts/user-repository-contract';

export class UserRepository extends BaseRepository implements UserRepositoryContract {
  constructor() {
    super('user');
  }

  async findUserRoles(userId: string): Promise<unknown[]> {
    return this.client.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  async assignRole(userId: string, roleId: string): Promise<unknown> {
    return this.client.userRole.create({
      data: { userId, roleId },
      include: { role: true },
    });
  }

  async removeRole(userId: string, roleId: string): Promise<unknown> {
    const existing = await this.client.userRole.findFirst({
      where: { userId, roleId },
    });
    if (!existing) return null;
    return this.client.userRole.delete({ where: { id: existing.id } });
  }

  async hasRole(userId: string, roleId: string): Promise<boolean> {
    const count = await this.client.userRole.count({ where: { userId, roleId } });
    return count > 0;
  }
}

export default UserRepository;
