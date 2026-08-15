import BaseRepository from './base-repository';
import type { AuditLog } from '@prisma/client';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'jwt', 'secret', 'creditCard'];

function sanitizeObject(obj: any): string | null {
  if (!obj) return null;
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj);
    } catch {
      return obj;
    }
  }

  const clean = { ...obj };
  for (const key of Object.keys(clean)) {
    if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
      clean[key] = '[REDACTED]';
    }
  }
  return JSON.stringify(clean);
}

export class AuditRepository extends BaseRepository {
  constructor() {
    super('auditLog');
  }

  // Append-Only Audit Logging
  async createAuditLog(data: {
    actorId?: string | null;
    action: string;
    resource: string;
    resourceId?: string | null;
    before?: any;
    after?: any;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuditLog> {
    return this.client.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId ?? null,
        before: sanitizeObject(data.before),
        after: sanitizeObject(data.after),
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  }

  async findAuditLogs(params: {
    actorId?: string;
    resource?: string;
    action?: string;
    limit?: number;
    page?: number;
  }) {
    const limit = Math.min(params.limit ?? 20, 100);
    const page = Math.max(params.page ?? 1, 1);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.resource) where.resource = params.resource;
    if (params.action) where.action = params.action;

    const [items, total] = await Promise.all([
      this.client.auditLog.findMany({
        where,
        include: { actor: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.client.auditLog.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        actorId: item.actorId,
        actorName: item.actor?.displayName || item.actor?.email || 'النظام (System)',
        action: item.action,
        resource: item.resource,
        resourceId: item.resourceId,
        before: item.before,
        after: item.after,
        ipAddress: item.ipAddress,
        createdAt: item.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

export default AuditRepository;
