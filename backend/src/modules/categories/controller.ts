import { randomUUID } from 'node:crypto';
import type { ControllerRequest } from '../../controllers';
import { success, created, validationError, internalError } from '../../api';
import type { ApiResponse } from '../../api';
import { PrismaService } from '../../repositories/prisma-service';

export class CategoriesController {
  private readonly prisma = PrismaService.getClient();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  private text(value: unknown, max = 120): string {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
  }

  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const search = this.text(request.query?.search, 120);
    try {
      const rows = await this.prisma.category.findMany({
        where: { deletedAt: null, ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] } : {}) },
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true, children: true } } },
      });
      return success(rows, ctx);
    } catch {
      return internalError('categories_unavailable', ctx);
    }
  }

  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const body = (request.body ?? {}) as Record<string, unknown>;
    const name = this.text(body.name);
    const slug = this.text(body.slug, 120).toLowerCase();
    const parentId = this.text(body.parentId, 50) || null;
    if (!name) return validationError('category_name_required', ctx);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return validationError('category_slug_invalid', ctx);
    try {
      const row = await this.prisma.category.create({ data: { id: randomUUID(), name, slug, parentId } });
      return created(row, ctx);
    } catch {
      return internalError('category_create_failed', ctx);
    }
  }

  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const name = this.text(body.name);
    const slug = this.text(body.slug, 120).toLowerCase();
    if (!id) return validationError('category_id_required', ctx);
    if (!name) return validationError('category_name_required', ctx);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return validationError('category_slug_invalid', ctx);
    try {
      const row = await this.prisma.category.update({ where: { id }, data: { name, slug, parentId: this.text(body.parentId, 50) || null } });
      return success(row, ctx);
    } catch {
      return internalError('category_update_failed', ctx);
    }
  }

  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('category_id_required', ctx);
    try {
      const used = await this.prisma.product.count({ where: { categoryId: id, deletedAt: null } });
      if (used > 0) return validationError('category_has_products', ctx);
      await this.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError('category_delete_failed', ctx);
    }
  }
}

export default CategoriesController;
