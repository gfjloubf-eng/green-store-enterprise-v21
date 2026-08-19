import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { NotFoundException } from '../../repositories/exceptions';
import DeliveryDriverRepository from '../../repositories/delivery-driver-repository';
import { ValidationException } from '../../validation';

export class DeliveryController {
  private readonly driverRepo = new DeliveryDriverRepository();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  private tenantId(request: ControllerRequest): string | null {
    return ((request.context?.user as any)?.tenantId ?? null) as string | null;
  }

  private value(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  private mapDriver(entity: any) {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      vehicleInfo: entity.vehicleInfo,
      deliveriesCount: entity._count?.deliveries ?? 0,
      createdAt: entity.createdAt?.toISOString?.() ?? entity.createdAt,
    };
  }

  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      this.requireUser(request);
      const query = request.query ?? {};
      const page = this.integer(this.value(query.page), 1, 100000);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const search = this.value(query.search)?.trim();
      if (search && search.length > 120) throw new ValidationException('search_too_long');

      const result = await this.driverRepo.list({ tenantId: this.tenantId(request), search, page, limit });
      return paginated(result.data.map((entry: any) => this.mapDriver(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async get(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      this.requireUser(request);
      const id = request.params?.id ?? '';
      if (!id) throw new ValidationException('driver_id_required');
      const entity = await this.driverRepo.findByIdForTenant(id, this.tenantId(request));
      return entity ? success(this.mapDriver(entity), ctx) : notFound('driver_not_found', ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      this.requireUser(request);
      const body = (request.body ?? {}) as Record<string, unknown>;
      const name = this.text(body.name, 'driver_name_required', 120);
      const phone = this.optionalText(body.phone, 40);
      const vehicleInfo = this.optionalText(body.vehicleInfo, 160);
      const entity = await this.driverRepo.createForTenant({ tenantId: this.tenantId(request), name, phone, vehicleInfo });
      return created(this.mapDriver(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      this.requireUser(request);
      const id = request.params?.id ?? '';
      if (!id) throw new ValidationException('driver_id_required');
      const body = (request.body ?? {}) as Record<string, unknown>;
      const payload = {
        ...(body.name !== undefined ? { name: this.text(body.name, 'driver_name_required', 120) } : {}),
        ...(body.phone !== undefined ? { phone: this.optionalText(body.phone, 40) } : {}),
        ...(body.vehicleInfo !== undefined ? { vehicleInfo: this.optionalText(body.vehicleInfo, 160) } : {}),
      };
      if (Object.keys(payload).length === 0) throw new ValidationException('driver_update_empty');
      const entity = await this.driverRepo.updateForTenant(id, this.tenantId(request), payload);
      return entity ? success(this.mapDriver(entity), ctx) : notFound('driver_not_found', ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      this.requireUser(request);
      const id = request.params?.id ?? '';
      if (!id) throw new ValidationException('driver_id_required');
      const removed = await this.driverRepo.deleteForTenant(id, this.tenantId(request));
      if (!removed) throw new NotFoundException('driver_not_found');
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  private requireUser(request: ControllerRequest) {
    if (!request.context?.user?.id) throw new Error('authentication_required');
  }

  private text(value: unknown, errorCode: string, maxLength: number): string {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) throw new ValidationException(errorCode);
    return value.trim();
  }

  private optionalText(value: unknown, maxLength: number): string | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value !== 'string' || value.trim().length > maxLength) throw new ValidationException('driver_field_invalid');
    return value.trim();
  }

  private integer(value: string | undefined, fallback: number, max: number): number {
    if (value === undefined) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException('pagination_invalid');
    return parsed;
  }

  private error(error: unknown, ctx: ReturnType<DeliveryController['context']>): ApiResponse<unknown> {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException) return notFound(error.message, ctx);
    if (error instanceof Error && error.message === 'authentication_required') return unauthorized('authentication_required', ctx);
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: 'internal_error' }, meta: ctx } };
  }
}

export default DeliveryController;
