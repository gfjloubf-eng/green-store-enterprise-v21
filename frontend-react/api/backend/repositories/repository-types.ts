export interface RepositoryOptions {
  tenantId?: string;
  branchId?: string;
}

export interface TransactionOptions {
  /** Provides an existing Prisma client instance (transaction client) */
  tx?: unknown;
}

export interface SortingOptions {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilteringOptions {
  filters?: Record<string, any>;
}

export interface SearchOptions {
  search?: string;
}

export interface PaginationOptionsFull {
  page?: number;
  limit?: number;
  offset?: number;
}
