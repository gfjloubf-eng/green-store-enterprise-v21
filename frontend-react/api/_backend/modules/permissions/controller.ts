import { success, created, paginated, noContent, HTTP_STATUS } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { ServiceFactory } from '../../services/service-factory';
import type { CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto } from '../../dto/permission';
import { ValidationException } from '../../validation';

const PERMISSION_ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LIST', 'EXECUTE'];

export class PermissionsController {
  private readonly permissionService = ServiceFactory.createPermissionService();

  private createApiContext(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as any,
      locale: request.context?.metadata?.locale,
    };
}

  private mapToDto(entity: any): PermissionResponseDto {
    return {
      id: entity.id,
      name: typeof entity.name === 'string' && entity.name ? entity.name : `${entity.resource}_${entity.action}`,
      resource: entity.resource,
      action: entity.action,
      description: entity.description ?? null,
      createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt).toISOString() : new Date().toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null,
    };
  }

  public async list(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const q = request.query ?? {};
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 25);
    const rawSort = (q.sort as string | undefined) ?? undefined;
    const rawOrder = (q.order as string | undefined) ?? undefined;
    const allowedSorts = ['id', 'resource', 'action', 'createdAt', 'updatedAt'];
    const sort = rawSort && allowedSorts.includes(rawSort) ? rawSort : undefined;
    const order = rawOrder === 'desc' ? 'desc' : 'asc';

    const search = q.search as string | undefined;

    // parse filters if provided as JSON string
    let filters: any = {};
    if (q.filters && typeof q.filters === 'string') {
      try {
        filters = JSON.parse(q.filters as string) ?? {};
      } catch {}
    } else if (typeof q.filters === 'object') {
      filters = q.filters;
    }

    // build Prisma-style where with search
    if (search && search.trim()) {
      const s = search.trim();
      const orCond = [
        { resource: { contains: s } },
        { description: { contains: s } },
      ];

      if (filters && Object.keys(filters).length > 0) {
        filters = { AND: [filters, { OR: orCond }] };
      } else {
        filters = { OR: orCond };
      }
    }

    const options = { page, limit, sort, order, filters };

    try {
      const resultAny: any = await this.permissionService.paginate(options as any);
      const data = (resultAny.data ?? []).map((e: any) => this.mapToDto(e));
      return paginated(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async get(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const id = request.params?.id as string | undefined;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'id_required' }, meta: ctx } };

    try {
      const result = await this.permissionService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: 'permission_not_found' }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async create(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const body = request.body as any;
    if (!body || typeof body !== 'object' || typeof body.resource !== 'string' || !body.resource) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'resource_required' }, meta: ctx } };
    }
    if (typeof body.action !== 'string' || !PERMISSION_ACTIONS.includes(body.action)) {
      return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: 'validation_error', message: 'action_invalid' }, meta: ctx } };
    }

    try {
      const payload: any = {
        resource: body.resource,
        action: body.action,
      };
      if (body.description !== undefined) payload.description = body.description;

      const createdPermission = await this.permissionService.create(payload as CreatePermissionDto);
      return created(this.mapToDto(createdPermission), ctx);
    } catch (err: any) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: 'validation_error', message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async update(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const id = request.params?.id as string | undefined;
    const body = request.body as any;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'id_required' }, meta: ctx } };
    if (!body || typeof body !== 'object') return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'data_required' }, meta: ctx } };
    if (body.action !== undefined && (typeof body.action !== 'string' || !PERMISSION_ACTIONS.includes(body.action))) {
      return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: 'validation_error', message: 'action_invalid' }, meta: ctx } };
    }

    try {
      const payload: any = {};
      if (body.resource !== undefined) payload.resource = body.resource;
      if (body.action !== undefined) payload.action = body.action;
      if (body.description !== undefined) payload.description = body.description;

      const updated = await this.permissionService.update(id, payload as UpdatePermissionDto);
      return success(this.mapToDto(updated), ctx);
    } catch (err: any) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: 'validation_error', message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async remove(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const id = request.params?.id as string | undefined;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'id_required' }, meta: ctx } };

    try {
      await this.permissionService.delete(id);
      return noContent(ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async restore(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const id = request.params?.id as string | undefined;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'id_required' }, meta: ctx } };

    try {
      const restored = await this.permissionService.restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }
}

export default PermissionsController;

