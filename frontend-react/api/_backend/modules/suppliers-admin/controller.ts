import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { NotFoundException } from '../../repositories/exceptions';
import SupplierAdminRepository from '../../repositories/supplier-admin-repository';
import { ValidationException } from '../../validation';

export class SupplierAdminController {
  private readonly repository = new SupplierAdminRepository();

  private context(request: ControllerRequest) {
    return { timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(), requestId: request.context?.metadata?.requestId, version: 'v1' as const, locale: request.context?.metadata?.locale };
  }

  private tenantId(request: ControllerRequest): string | null {
    return ((request.context?.user as any)?.tenantId ?? null) as string | null;
  }

  private value(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

  private map(entity: any) {
    return { id: entity.id, name: entity.name, code: entity.code, contactsCount: entity._count?.contacts ?? entity.contacts?.length ?? 0, addressesCount: entity._count?.addresses ?? entity.addresses?.length ?? 0, purchaseOrdersCount: entity._count?.purchaseOrders ?? 0, createdAt: entity.createdAt?.toISOString?.() ?? entity.createdAt, updatedAt: entity.updatedAt?.toISOString?.() ?? entity.updatedAt };
  }

  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const query = request.query ?? {};
      const page = this.integer(this.value(query.page), 1, 100000);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const search = this.value(query.search)?.trim();
      if (search && search.length > 120) throw new ValidationException('search_too_long');
      const result = await this.repository.list({ tenantId: this.tenantId(request), search, page, limit });
      return paginated(result.data.map((entry: any) => this.map(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) { return this.error(error, ctx); }
  }

  async get(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const entity = await this.repository.findByIdForTenant(request.params?.id ?? '', this.tenantId(request));
      return entity ? success(this.map(entity), ctx) : notFound('supplier_not_found', ctx);
    } catch (error) { return this.error(error, ctx); }
  }

  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const body = (request.body ?? {}) as Record<string, unknown>;
      const name = this.text(body.name, 'supplier_name_required', 160);
      const code = this.optionalText(body.code, 80);
      const entity = await this.repository.createForTenant({ tenantId: this.tenantId(request), name, code });
      return created(this.map(entity), ctx);
    } catch (error) { return this.error(error, ctx); }
  }

  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const body = (request.body ?? {}) as Record<string, unknown>;
      const data = { ...(body.name !== undefined ? { name: this.text(body.name, 'supplier_name_required', 160) } : {}), ...(body.code !== undefined ? { code: this.optionalText(body.code, 80) } : {}) };
      if (!Object.keys(data).length) throw new ValidationException('supplier_update_empty');
      const entity = await this.repository.updateForTenant(request.params?.id ?? '', this.tenantId(request), data);
      return entity ? success(this.map(entity), ctx) : notFound('supplier_not_found', ctx);
    } catch (error) { return this.error(error, ctx); }
  }

  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const removed = await this.repository.softDeleteForTenant(request.params?.id ?? '', this.tenantId(request));
      if (!removed) throw new NotFoundException('supplier_not_found');
      return noContent(ctx);
    } catch (error) { return this.error(error, ctx); }
  }

  private text(value: unknown, code: string, max: number) { if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new ValidationException(code); return value.trim(); }
  private optionalText(value: unknown, max: number): string | null { if (value === undefined || value === null || value === '') return null; if (typeof value !== 'string' || value.trim().length > max) throw new ValidationException('supplier_field_invalid'); return value.trim(); }
  private integer(value: string | undefined, fallback: number, max: number) { if (value === undefined) return fallback; const parsed = Number(value); if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException('pagination_invalid'); return parsed; }
  private error(error: unknown, ctx: ReturnType<SupplierAdminController['context']>): ApiResponse<unknown> { if (error instanceof ValidationException) return validationError(error.message, ctx); if (error instanceof NotFoundException) return notFound(error.message, ctx); return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: 'internal_error' }, meta: ctx } }; }
}

export default SupplierAdminController;
