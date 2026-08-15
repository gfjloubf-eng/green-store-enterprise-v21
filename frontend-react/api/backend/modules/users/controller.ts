import { success, created, paginated, noContent, HTTP_STATUS } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { ServiceFactory } from '../../services/service-factory';
import type { CreateUserDto, UpdateUserDto, UserResponseDto } from '../../dto/user';
import { ValidationException } from '../../validation';
import { ConflictException, NotFoundException } from '../../repositories/exceptions';

export class UsersController {
  private readonly userService = ServiceFactory.createUserService();

  private createApiContext(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as any,
      locale: request.context?.metadata?.locale,
    };
  }

  private mapToDto(entity: any): UserResponseDto {
    return {
      id: entity.id,
      fullName: entity.displayName ?? null,
      email: entity.email,
      phone: entity.phone ?? null,
      createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt).toISOString() : new Date().toISOString(),
      deletedAt: entity.deletedAt ? (new Date(entity.deletedAt)).toISOString() : null,
    };
  }

  public async list(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const q = request.query ?? {};
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 25);
    const rawSort = (q.sort as string | undefined) ?? undefined;
    const rawOrder = (q.order as string | undefined) ?? undefined;
    const allowedSorts = ['id', 'email', 'createdAt', 'updatedAt', 'displayName'];
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
        { displayName: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } },
      ];

      // if filters has other conditions, combine with AND, otherwise use OR directly
      if (filters && Object.keys(filters).length > 0) {
        filters = { AND: [filters, { OR: orCond }] };
      } else {
        filters = { OR: orCond };
      }
    }

    const options = { page, limit, sort, order, filters };

    try {
      // log options shape for debugging malformed filter issues
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[UsersController] paginate options:', JSON.stringify(options));
      }
      const resultAny: any = await this.userService.paginate(options as any);
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
      const result = await this.userService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: 'user_not_found' }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }
  }

  public async create(request: ControllerRequest): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    const body = request.body as any;
    if (!body || typeof body !== 'object' || typeof body.email !== 'string' || !body.email) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'email_required' }, meta: ctx } };
    }

    try {
      const createdUser = await this.userService.create(body as CreateUserDto);
      return created(this.mapToDto(createdUser), ctx);
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
      const updated = await this.userService.update(id, body as UpdateUserDto);
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
      await this.userService.delete(id);
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
      const restored = await (this.userService as any).restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err: any) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
    }

  }

  public async listRoles(request: ControllerRequest): Promise<ApiResponse<any>> {
      const ctx = this.createApiContext(request);
      const userId = request.params?.userId as string | undefined;
      if (!userId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'user_id_required' }, meta: ctx } };
      try {
        const result = await (this.userService as any).listRoles(userId);
        const roles = (result.roles ?? []).map((assignment: any) => assignment.role ?? assignment);
        return success({ userId: result.userId, roles }, ctx);
      } catch (err: any) {
        return this.relationshipError(err, ctx);
      }
    }

  public async assignRole(request: ControllerRequest): Promise<ApiResponse<any>> {
      const ctx = this.createApiContext(request);
      const userId = request.params?.userId as string | undefined;
      const roleId = (request.body as any)?.roleId as string | undefined;
      if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'user_id_and_role_id_required' }, meta: ctx } };
      try {
        return created(await (this.userService as any).assignRole(userId, roleId), ctx);
      } catch (err: any) {
        return this.relationshipError(err, ctx);
      }
    }

  public async removeRole(request: ControllerRequest): Promise<ApiResponse<any>> {
      const ctx = this.createApiContext(request);
      const userId = request.params?.userId as string | undefined;
      const roleId = request.params?.roleId as string | undefined;
      if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'user_id_and_role_id_required' }, meta: ctx } };
      try {
        await (this.userService as any).removeRole(userId, roleId);
        return noContent(ctx);
      } catch (err: any) {
        return this.relationshipError(err, ctx);
      }
    }

  public async checkRole(request: ControllerRequest): Promise<ApiResponse<any>> {
      const ctx = this.createApiContext(request);
      const userId = request.params?.userId as string | undefined;
      const roleId = request.params?.roleId as string | undefined;
      if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: 'bad_request', message: 'user_id_and_role_id_required' }, meta: ctx } };
      try {
        return success({ assigned: await (this.userService as any).checkRole(userId, roleId) }, ctx);
      } catch (err: any) {
        return this.relationshipError(err, ctx);
      }
    }

  private relationshipError(err: any, ctx: any): ApiResponse<any> {
      if (err instanceof ConflictException) return { statusCode: HTTP_STATUS.CONFLICT, body: { success: false, error: { code: 'conflict', message: err.message }, meta: ctx } };
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: 'not_found', message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: err?.message ?? 'internal_error' }, meta: ctx } };
  }
}

export default UsersController;
