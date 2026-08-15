export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export { PaginationMeta as PaginationMetaType, PaginationResult as PaginationResultType };
