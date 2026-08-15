import { conflict, created, HTTP_STATUS, noContent, notFound, paginated, success, validationError } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { ConflictException, NotFoundException } from '../../repositories/exceptions';
import { ServiceFactory } from '../../services/service-factory';
import { ValidationException } from '../../validation';
import type { CreateProductDto, ProductResponseDto, UpdateProductDto } from '../../dto/product';
import type { Product } from '@prisma/client';

export class ProductsController {
  private readonly productService = ServiceFactory.createProductService();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  private mapToDto(entity: Product): ProductResponseDto {
    return {
      id: entity.id,
      sku: entity.sku ?? null,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? null,
      brandId: entity.brandId ?? null,
      unitId: entity.unitId ?? null,
      categoryId: entity.categoryId ?? null,
      subcategoryId: entity.subcategoryId ?? null,
      isPublished: Boolean(entity.isPublished),
      createdAt: new Date(entity.createdAt).toISOString(),
      updatedAt: new Date(entity.updatedAt).toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null,
    };
  }

  private queryValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  private parseFilters(value: string | string[] | undefined): Record<string, unknown> {
    const raw = this.queryValue(value);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('filters_invalid');
      const allowed = ['sku', 'name', 'slug', 'brandId', 'unitId', 'categoryId', 'subcategoryId', 'isPublished'];
      const filters = parsed as Record<string, unknown>;
      for (const [key, filterValue] of Object.entries(filters)) {
        if (!allowed.includes(key)) throw new Error('filter_invalid');
        if (key === 'isPublished' && typeof filterValue !== 'boolean') throw new Error('filter_invalid');
        if (key !== 'isPublished' && (typeof filterValue !== 'string' || !filterValue.trim())) throw new Error('filter_invalid');
      }
      return filters;
    } catch {
      throw new ValidationException('filters_invalid');
    }
  }

  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const q = request.query ?? {};
    try {
      const page = this.parsePositiveInteger(this.queryValue(q.page), 1);
      const limit = this.parsePositiveInteger(this.queryValue(q.limit), 25, 100);
      const rawSort = this.queryValue(q.sort);
      const rawOrder = this.queryValue(q.order);
      const allowedSorts = ['id', 'sku', 'name', 'slug', 'isPublished', 'createdAt', 'updatedAt'];
      if (rawSort && !allowedSorts.includes(rawSort)) throw new ValidationException('sort_invalid');
      if (rawOrder && rawOrder !== 'asc' && rawOrder !== 'desc') throw new ValidationException('order_invalid');
      const sort = rawSort;
      const order = rawOrder === 'desc' ? 'desc' : 'asc';
      const filters = this.parseFilters(q.filters);
      const search = this.queryValue(q.search)?.trim();
      if (search && search.length > 255) throw new ValidationException('search_too_long');
      const searchCondition = {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }, { sku: { contains: search } }, { description: { contains: search } }],
      };
      const where = search
        ? (Object.keys(filters).length > 0 ? { AND: [filters, searchCondition] } : searchCondition)
        : filters;
      const result = await this.productService.paginate({ page, limit, sort, order, filters: where });
      const data = result.data.map((entity) => this.mapToDto(entity));
      return paginated(data, result.page ?? page, result.limit ?? limit, result.total ?? 0, ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  async get(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('id_required', ctx);
    try {
      const product = await this.productService.findById(id);
      return product ? success(this.mapToDto(product), ctx) : notFound('product_not_found', ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const product = await this.productService.create(request.body as CreateProductDto);
      return created(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('id_required', ctx);
    try {
      const product = await this.productService.update(id, request.body as UpdateProductDto);
      return success(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('id_required', ctx);
    try {
      await this.productService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  async restore(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('id_required', ctx);
    try {
      const product = await this.productService.restore(id);
      return success(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }

  private error(err: unknown, ctx: ReturnType<ProductsController['context']>): ApiResponse<unknown> {
    if (err instanceof ValidationException) return validationError(err.message, ctx);
    if (err instanceof NotFoundException) return notFound(err.message, ctx);
    if (err instanceof ConflictException) return conflict(err.message, ctx);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { success: false, error: { code: 'internal_error', message: err instanceof Error ? err.message : 'internal_error' }, meta: ctx },
    };
  }

  private parsePositiveInteger(value: string | undefined, fallback: number, maximum = Number.MAX_SAFE_INTEGER): number {
    if (value === undefined) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) throw new ValidationException('pagination_invalid');
    return parsed;
  }

}

export default ProductsController;
