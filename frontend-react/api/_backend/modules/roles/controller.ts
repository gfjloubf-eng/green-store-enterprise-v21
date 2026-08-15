import { success, created, paginated, noContent, HTTP_STATUS } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { ServiceFactory } from '../../services/service-factory';
import type { CreateRoleDto, UpdateRoleDto, RoleResponseDto, AssignPermissionDto, RolePermissionResponseDto, RolePermissionsResponseDto } from '../../dto/role';
import { ConflictException, NotFoundException } from '../../repositories/exceptions';
import { ValidationException } from '../../validation';

export class RolesController {
  private readonly roleService = ServiceFactory.createRoleService();

  private createApiContext(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as any,
      locale: request.context?.metadata?.locale,
    };
  }

  private mapToDto(entity: any): RoleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      displayName: entity.displayName ?? null,
      description: entity.description ?? null,
      isSystem: typeof entity.isSystem === 'boolean' ? entity.isSystem : null,
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
    const allowedSorts = ['id', 'name', 'createdAt', 'updatedAt', 'displayName'];
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
        { name: { contains: s } },
        { displayName: { contains: s } },
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
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[RolesController] paginate options:', JSON.stringify(options));
      }

      const resultAny: any = await this.roleService.paginate(options as any);
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
      const result = await this.roleService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: 'role_not_found' }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async create(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const body = request.body as any;
    if (!body || typeof body !== 'object' || typeof body.name !== 'string' || !body.name) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'name_required' }, meta: ctx } };
    }

    try {
      // sanitize payload to allowed create fields (Prisma model Role expects: name, description, isSystem)
      const payload: any = {
        name: body.name,
      };
      if (body.description !== undefined) payload.description = body.description;

      const createdRole = await this.roleService.create(payload as CreateRoleDto);
      return created(this.mapToDto(createdRole), ctx);
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

    try {
      // sanitize update payload to allowed updatable fields
      const payload: any = {};
      if (body.description !== undefined) payload.description = body.description;

      const updated = await this.roleService.update(id, payload as UpdateRoleDto);
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
      await this.roleService.delete(id);
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
      const restored = await (this.roleService as any).restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  private mapPermissionEntity(entity: any): RolePermissionResponseDto {
    const permission = entity?.permission ?? null;
    return {
      id: entity?.id ?? '',
      roleId: entity?.roleId ?? '',
      permissionId: entity?.permissionId ?? '',
      createdAt: entity?.createdAt ? new Date(entity.createdAt).toISOString() : new Date().toISOString(),
      permission: permission
        ? {
            id: permission.id,
            name: typeof permission.name === 'string' && permission.name ? permission.name : `${permission.resource}_${permission.action}`,
            resource: permission.resource,
            action: permission.action,
            description: permission.description ?? null,
          }
        : null,
    };
  }

  public async listPermissions(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const roleId = request.params?.roleId as string | undefined;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'role_id_required' }, meta: ctx } };

    try {
      const result: any = await this.roleService.listPermissions(roleId);
      const dto: RolePermissionsResponseDto = {
        role: this.mapToDto(result.role),
        permissions: (result.permissions ?? []).map((e: any) => this.mapPermissionEntity(e)),
      };
      return success(dto, ctx);
    } catch (err: any) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async assignPermission(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const roleId = request.params?.roleId as string | undefined;
    const body = request.body as any;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'role_id_required' }, meta: ctx } };
    if (!body || typeof body !== 'object' || typeof body.permissionId !== 'string' || !body.permissionId) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'permission_id_required' }, meta: ctx } };
    }

    try {
      const result = await this.roleService.assignPermission(roleId, body.permissionId as string);
      return created(this.mapPermissionEntity(result), ctx);
    } catch (err: any) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: err.message }, meta: ctx } };
      if (err instanceof ConflictException) return { statusCode: HTTP_STATUS.CONFLICT, body: { success: false, error: { code: 'conflict', message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async removePermission(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const roleId = request.params?.roleId as string | undefined;
    const permissionId = request.params?.permissionId as string | undefined;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'role_id_required' }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'permission_id_required' }, meta: ctx } };

    try {
      await this.roleService.removePermission(roleId, permissionId);
      return noContent(ctx);
    } catch (err: any) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async checkPermission(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const roleId = request.params?.roleId as string | undefined;
    const permissionId = request.params?.permissionId as string | undefined;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'role_id_required' }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'permission_id_required' }, meta: ctx } };

    try {
      const exists = await this.roleService.checkPermission(roleId, permissionId);
      return success({ assigned: exists }, ctx);
    } catch (err: any) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }
}

export default RolesController;
