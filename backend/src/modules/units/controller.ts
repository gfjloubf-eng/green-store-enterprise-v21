import { randomUUID } from 'node:crypto';
import type { ControllerRequest } from '../../controllers';
import { success, created, validationError, internalError } from '../../api';
import type { ApiResponse } from '../../api';
import { PrismaService } from '../../repositories/prisma-service';

const UNIT_TYPES = new Set(['PIECE', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA']);

export class UnitsController {
  private readonly prisma = PrismaService.getClient();
  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }
  private text(value: unknown, max = 80): string {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
  }
  private type(value: unknown): string {
    const valueText = this.text(value, 20).toUpperCase();
    return UNIT_TYPES.has(valueText) ? valueText : '';
  }
  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const search = this.text(request.query?.search);
    try {
      const rows = await this.prisma.unit.findMany({
        where: { deletedAt: null, ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { symbol: { contains: search, mode: 'insensitive' } }] } : {}) },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        include: { _count: { select: { products: true } } },
      });
      return success(rows, ctx);
    } catch {
      return internalError('units_unavailable', ctx);
    }
  }
  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const body = (request.body ?? {}) as Record<string, unknown>;
    const name = this.text(body.name);
    const symbol = this.text(body.symbol, 20) || null;
    const type = this.type(body.type);
    if (!name) return validationError('unit_name_required', ctx);
    if (!type) return validationError('unit_type_invalid', ctx);
    try {
      const row = await this.prisma.unit.create({ data: { id: randomUUID(), name, symbol, type: type as any } });
      return created(row, ctx);
    } catch {
      return internalError('unit_create_failed', ctx);
    }
  }
  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const name = this.text(body.name);
    const symbol = this.text(body.symbol, 20) || null;
    const type = this.type(body.type);
    if (!id) return validationError('unit_id_required', ctx);
    if (!name) return validationError('unit_name_required', ctx);
    if (!type) return validationError('unit_type_invalid', ctx);
    try {
      const row = await this.prisma.unit.update({ where: { id }, data: { name, symbol, type: type as any } });
      return success(row, ctx);
    } catch {
      return internalError('unit_update_failed', ctx);
    }
  }
  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('unit_id_required', ctx);
    try {
      const used = await this.prisma.product.count({ where: { unitId: id } });
      if (used > 0) return validationError('unit_has_products', ctx);
      await this.prisma.unit.update({ where: { id }, data: { deletedAt: new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError('unit_delete_failed', ctx);
    }
  }
}
export default UnitsController;
