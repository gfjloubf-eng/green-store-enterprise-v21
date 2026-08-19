import BaseRepository from './base-repository';

export interface SupplierAdminListOptions {
  tenantId?: string | null;
  search?: string;
  page?: number;
  limit?: number;
}

export class SupplierAdminRepository extends BaseRepository {
  constructor() {
    super('supplier');
  }

  private where(options: SupplierAdminListOptions = {}) {
    const where: Record<string, unknown> = { tenantId: options.tenantId ?? null, deletedAt: null };
    if (options.search?.trim()) {
      const search = options.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async list(options: SupplierAdminListOptions = {}) {
    const page = Math.max(1, Math.floor(options.page ?? 1));
    const limit = Math.max(1, Math.min(100, Math.floor(options.limit ?? 25)));
    const where = this.where(options);
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { contacts: true, addresses: true, purchaseOrders: true } },
        },
      }),
      this.model.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findByIdForTenant(id: string, tenantId?: string | null) {
    return this.model.findFirst({
      where: { id, tenantId: tenantId ?? null, deletedAt: null },
      include: { contacts: true, addresses: { include: { address: true } }, _count: { select: { purchaseOrders: true } } },
    });
  }

  async createForTenant(data: { tenantId?: string | null; name: string; code?: string | null }) {
    return this.model.create({
      data: { tenantId: data.tenantId ?? null, name: data.name, code: data.code ?? null },
      include: { _count: { select: { contacts: true, addresses: true, purchaseOrders: true } } },
    });
  }

  async updateForTenant(id: string, tenantId: string | null | undefined, data: { name?: string; code?: string | null }) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return null;
    return this.model.update({ where: { id }, data, include: { _count: { select: { contacts: true, addresses: true, purchaseOrders: true } } } });
  }

  async softDeleteForTenant(id: string, tenantId?: string | null) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return false;
    await this.model.update({ where: { id }, data: { deletedAt: new Date() } });
    return true;
  }
}

export default SupplierAdminRepository;
