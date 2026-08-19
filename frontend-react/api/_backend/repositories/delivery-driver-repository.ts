import BaseRepository from './base-repository';

export interface DeliveryDriverListOptions {
  tenantId?: string | null;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryDriverPayload {
  tenantId?: string | null;
  name: string;
  phone?: string | null;
  vehicleInfo?: string | null;
}

export class DeliveryDriverRepository extends BaseRepository {
  constructor() {
    super('deliveryDriver');
  }

  async list(options: DeliveryDriverListOptions = {}) {
    const page = Math.max(1, Math.floor(options.page ?? 1));
    const limit = Math.max(1, Math.min(100, Math.floor(options.limit ?? 25)));
    const search = options.search?.trim();
    const where: Record<string, unknown> = {
      tenantId: options.tenantId ?? null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { vehicleInfo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { deliveries: true } } },
      }),
      this.model.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findByIdForTenant(id: string, tenantId?: string | null) {
    return this.model.findFirst({
      where: { id, tenantId: tenantId ?? null },
      include: { _count: { select: { deliveries: true } } },
    });
  }

  async createForTenant(payload: DeliveryDriverPayload) {
    return this.model.create({
      data: {
        tenantId: payload.tenantId ?? null,
        name: payload.name,
        phone: payload.phone ?? null,
        vehicleInfo: payload.vehicleInfo ?? null,
      },
      include: { _count: { select: { deliveries: true } } },
    });
  }

  async updateForTenant(id: string, tenantId: string | null | undefined, payload: Partial<DeliveryDriverPayload>) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return null;

    return this.model.update({
      where: { id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.vehicleInfo !== undefined ? { vehicleInfo: payload.vehicleInfo } : {}),
      },
      include: { _count: { select: { deliveries: true } } },
    });
  }

  async deleteForTenant(id: string, tenantId?: string | null) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return false;
    await this.model.delete({ where: { id } });
    return true;
  }
}

export default DeliveryDriverRepository;
