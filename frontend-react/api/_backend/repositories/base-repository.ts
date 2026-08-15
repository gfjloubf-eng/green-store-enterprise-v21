import PrismaService from './prisma-service';
import { Filter } from './contracts/filtering-contract';
import { PaginationOptions, PaginatedResult } from './contracts/pagination-contract';
import { NotFoundException } from './exceptions';

/**
 * A pragmatic, generic BaseRepository
 * - modelName must match the PrismaClient property for the model (e.g., 'tenant', 'user')
 * - Uses unknown for payloads to keep this layer flexible while avoiding `any` as much as possible
 */
export abstract class BaseRepository {
  protected client = PrismaService.getClient();
  protected readonly modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  protected get model() {
    // runtime dynamic access to the model delegate
    // Typed as unknown to avoid leaking `any` across the layer
    return (this.client as unknown as Record<string, unknown>)[this.modelName] as any;
  }

  async findById(id: string): Promise<unknown | null> {
    const result = await this.model.findUnique({ where: { id } });
    return result ?? null;
  }

  async findMany(filter?: Filter): Promise<unknown[]> {
    const where = filter ?? {};
    const results = await this.model.findMany({ where });
    return results ?? [];
  }

  async create(data: unknown): Promise<unknown> {
    return this.model.create({ data });
  }

  async update(id: string, data: unknown): Promise<unknown> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    // soft delete if deletedAt exists, otherwise perform hard delete
    try {
      await this.model.update({ where: { id }, data: { deletedAt: new Date() } });
    } catch (err) {
      // fallback to hard delete if soft-delete column not present
      await this.model.delete({ where: { id } });
    }
  }

  async restore(id: string): Promise<unknown> {
    return this.model.update({ where: { id }, data: { deletedAt: null } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }

  async count(filter?: Filter): Promise<number> {
    const where = filter ?? {};
    return this.model.count({ where });
  }

  async paginate(options: PaginationOptions): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 25));
    const skip = (page - 1) * limit;

    const rawWhere = options.filters ?? {};

    // Deep-clean the where object to remove undefined values and empty conditions
    const cleanWhere = (obj: any): any => {
      if (obj == null) return {};
      if (Array.isArray(obj)) {
        const arr = obj.map(cleanWhere).filter((x) => {
          return !(x && typeof x === 'object' && Object.keys(x).length === 0);
        });
        return arr.length > 0 ? arr : undefined;
      }
      if (typeof obj !== 'object') return obj;

      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v === undefined) continue;
        if ((k === 'AND' || k === 'OR' || k === 'NOT') && Array.isArray(v)) {
          const cleaned = cleanWhere(v);
          if (cleaned !== undefined && cleaned.length > 0) out[k] = cleaned;
        } else if (v && typeof v === 'object') {
          const cleaned = cleanWhere(v);
          if (cleaned !== undefined && (typeof cleaned !== 'object' || Object.keys(cleaned).length > 0)) {
            out[k] = cleaned;
          }
        } else if (v !== undefined) {
          out[k] = v;
        }
      }
      return Object.keys(out).length > 0 ? out : undefined;
    };

    const where = cleanWhere(rawWhere) ?? {};

    const orderBy = options.sort && (options.order === 'asc' || options.order === 'desc') ? { [options.sort]: options.order } : undefined;

    let data: any[] = [];
    let total = 0;
    try {
      const res = await Promise.all([
        this.model.findMany({ where, skip, take: limit, orderBy }),
        this.model.count({ where }),
      ]);
      data = res[0] ?? [];
      total = res[1] ?? 0;
    } catch (err: any) {
      // Attach query shapes to error to aid debugging without leaking sensitive data
      const debug = { where, orderBy, skip, take: limit };
      const msg = `paginate_error: ${err?.message ?? 'unknown'} -- query: ${JSON.stringify(debug)}`;
      throw new Error(msg);
    }

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

export default BaseRepository;
