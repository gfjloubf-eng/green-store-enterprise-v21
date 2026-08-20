import type { ControllerRequest } from '../../controllers';
import { created, internalError, notFound, paginated, success, validationError } from '../../api';
import type { ApiResponse } from '../../api';
import { PrismaService } from '../../repositories/prisma-service';
import { randomUUID } from 'node:crypto';

export class EducationController {
  private readonly prisma = PrismaService.getClient();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  async listArticles(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const page = Math.max(1, Number(this.value(request.query?.page) ?? 1) || 1);
      const limit = Math.min(50, Math.max(1, Number(this.value(request.query?.limit) ?? 12) || 12));
      const [data, total] = await Promise.all([
        this.prisma.educationalArticle.findMany({
          where: { status: 'PUBLISHED', deletedAt: null },
          orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
          skip: (page - 1) * limit,
          take: limit,
          select: { id: true, slug: true, title: true, summary: true, articleType: true, coverImageUrl: true, coverImageSourceUrl: true, coverImageLicense: true, sourceUrls: true, publishedAt: true, family: { select: { familyKey: true, name: true } } },
        }),
        this.prisma.educationalArticle.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
      ]);
      return paginated(data, page, limit, total, ctx);
    } catch {
      return internalError('education_articles_unavailable', ctx);
    }
  }

  async getArticle(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const slug = request.params?.slug;
    if (!slug) return validationError('article_slug_required', ctx);
    try {
      const article = await this.prisma.educationalArticle.findFirst({
        where: { slug, status: 'PUBLISHED', deletedAt: null },
        include: { family: true, productLinks: { include: { product: { select: { id: true, name: true, slug: true, produceKey: true } } } } },
      });
      return article ? success(article, ctx) : notFound('education_article_not_found', ctx);
    } catch {
      return internalError('education_article_unavailable', ctx);
    }
  }

  async listAdminFamilies(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const rows = await this.prisma.productFamily.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true, articles: true } } },
      });
      return success(rows, ctx);
    } catch {
      return internalError('education_families_unavailable', ctx);
    }
  }

  async createAdminFamily(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const body = (request.body ?? {}) as Record<string, unknown>;
    const familyKey = this.text(body.familyKey, 80).toLowerCase();
    const name = this.text(body.name, 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(familyKey)) return validationError('family_key_invalid', ctx);
    if (!name) return validationError('family_name_required', ctx);
    try {
      const row = await this.prisma.productFamily.create({
        data: { id: randomUUID(), familyKey, name, description: this.optionalText(body.description, 1000) },
      });
      return created(row, ctx);
    } catch {
      return internalError('education_family_create_failed', ctx);
    }
  }

  async updateAdminFamily(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    const body = (request.body ?? {}) as Record<string, unknown>;
    if (!id) return validationError('family_id_required', ctx);
    const familyKey = this.text(body.familyKey, 80).toLowerCase();
    const name = this.text(body.name, 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(familyKey)) return validationError('family_key_invalid', ctx);
    if (!name) return validationError('family_name_required', ctx);
    try {
      const row = await this.prisma.productFamily.update({
        where: { id },
        data: { familyKey, name, description: this.optionalText(body.description, 1000) },
      });
      return success(row, ctx);
    } catch {
      return internalError('education_family_update_failed', ctx);
    }
  }

  async deleteAdminFamily(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('family_id_required', ctx);
    try {
      await this.prisma.productFamily.update({ where: { id }, data: { deletedAt: new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError('education_family_delete_failed', ctx);
    }
  }

  async listAdminArticles(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const search = this.optionalText(this.value(request.query?.search), 120);
    const status = this.optionalText(this.value(request.query?.status), 30);
    try {
      const rows = await this.prisma.educationalArticle.findMany({
        where: {
          deletedAt: null,
          ...(status ? { status } : {}),
          ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] } : {}),
        },
        orderBy: { updatedAt: 'desc' },
        take: 100,
        include: { family: { select: { id: true, familyKey: true, name: true } }, productLinks: { select: { productId: true, product: { select: { id: true, name: true, produceKey: true } } } } },
      });
      return success(rows, ctx);
    } catch {
      return internalError('admin_education_articles_unavailable', ctx);
    }
  }

  async createAdminArticle(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const body = (request.body ?? {}) as Record<string, unknown>;
    const input = this.articleInput(body);
    if (!input.slug || !input.title || !input.body) return validationError('education_article_fields_required', ctx);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const article = await tx.educationalArticle.create({ data: { id: randomUUID(), ...input.data } });
        if (input.productIds.length) await tx.articleProduct.createMany({ data: input.productIds.map((productId) => ({ id: randomUUID(), articleId: article.id, productId })) });
        return tx.educationalArticle.findUnique({ where: { id: article.id }, include: { family: true, productLinks: { include: { product: true } } } });
      });
      return created(row, ctx);
    } catch {
      return internalError('education_article_create_failed', ctx);
    }
  }

  async updateAdminArticle(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const input = this.articleInput(body);
    if (!id) return validationError('education_article_id_required', ctx);
    if (!input.slug || !input.title || !input.body) return validationError('education_article_fields_required', ctx);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const article = await tx.educationalArticle.update({ where: { id }, data: input.data });
        await tx.articleProduct.deleteMany({ where: { articleId: id } });
        if (input.productIds.length) await tx.articleProduct.createMany({ data: input.productIds.map((productId) => ({ id: randomUUID(), articleId: id, productId })) });
        return tx.educationalArticle.findUnique({ where: { id: article.id }, include: { family: true, productLinks: { include: { product: true } } } });
      });
      return success(row, ctx);
    } catch {
      return internalError('education_article_update_failed', ctx);
    }
  }

  async deleteAdminArticle(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const id = request.params?.id;
    if (!id) return validationError('education_article_id_required', ctx);
    try {
      await this.prisma.educationalArticle.update({ where: { id }, data: { deletedAt: new Date(), status: 'ARCHIVED' } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError('education_article_delete_failed', ctx);
    }
  }

  async createConsultation(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const body = (request.body ?? {}) as Record<string, unknown>;
    const contactName = typeof body.contactName === 'string' ? body.contactName.trim() : '';
    const goal = typeof body.goal === 'string' ? body.goal.trim() : '';
    const consent = body.consent === true;
    if (!contactName || contactName.length > 120) return validationError('consultation_name_invalid', ctx);
    if (!goal || goal.length > 1000) return validationError('consultation_goal_invalid', ctx);
    if (!consent) return validationError('consultation_consent_required', ctx);
    try {
      const record = await this.prisma.consultationRequest.create({
        data: {
          id: randomUUID(),
          contactName,
          contactPhone: typeof body.contactPhone === 'string' ? body.contactPhone.trim().slice(0, 40) : undefined,
          contactEmail: typeof body.contactEmail === 'string' ? body.contactEmail.trim().slice(0, 180) : undefined,
          goal,
          dietaryRestrictions: typeof body.dietaryRestrictions === 'string' ? body.dietaryRestrictions.trim().slice(0, 1000) : undefined,
          preferredContactTime: typeof body.preferredContactTime === 'string' ? body.preferredContactTime.trim().slice(0, 100) : undefined,
          consent: true,
          status: 'NEW',
        },
        select: { id: true, status: true, createdAt: true },
      });
      return created(record, ctx);
    } catch {
      return internalError('consultation_create_failed', ctx);
    }
  }

  async listConsultations(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const rows = await this.prisma.consultationRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      return success(rows, ctx);
    } catch {
      return internalError('consultations_unavailable', ctx);
    }
  }

  private articleInput(body: Record<string, unknown>) {
    const status = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(this.text(body.status, 20)) ? this.text(body.status, 20) : 'DRAFT';
    const productIds = Array.isArray(body.productIds) ? body.productIds.filter((value): value is string => typeof value === 'string' && value.length > 0).slice(0, 50) : [];
    const sourceUrls = Array.isArray(body.sourceUrls) ? body.sourceUrls.filter((value): value is string => typeof value === 'string' && /^https?:\/\//i.test(value.trim())).map((value) => value.trim()).slice(0, 20) : [];
    return {
      slug: this.text(body.slug, 160).toLowerCase(),
      title: this.text(body.title, 180),
      body: this.text(body.body, 20000),
      productIds,
      data: {
        slug: this.text(body.slug, 160).toLowerCase(),
        title: this.text(body.title, 180),
        summary: this.optionalText(body.summary, 500),
        body: this.text(body.body, 20000),
        articleType: this.optionalText(body.articleType, 40) ?? 'BENEFITS',
        status,
        coverImageUrl: this.optionalUrl(body.coverImageUrl),
        coverImageSourceUrl: this.optionalUrl(body.coverImageSourceUrl),
        coverImageLicense: this.optionalText(body.coverImageLicense, 120),
        sourceUrls,
        familyId: this.optionalText(body.familyId, 80),
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    };
  }

  private text(value: unknown, max: number): string {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
  }

  private optionalText(value: unknown, max: number): string | undefined {
    const text = this.text(value, max);
    return text || undefined;
  }

  private optionalUrl(value: unknown): string | undefined {
    const text = this.optionalText(value, 1000);
    return text && /^https?:\/\//i.test(text) ? text : undefined;
  }

  private value(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }
}

export default EducationController;
