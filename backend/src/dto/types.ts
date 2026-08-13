export interface BaseDto {
  readonly id?: string;
}

export interface IdentifierDto {
  readonly id: string;
}

export interface TimestampDto {
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly deletedAt?: string | null;
}

export interface PaginationDto {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface SortingDto {
  readonly sort?: string;
  readonly order?: 'asc' | 'desc';
}

export interface FilteringDto {
  readonly filters?: Record<string, unknown>;
}

export interface SearchDto {
  readonly search?: string;
}

export interface RequestMetadataDto {
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly timestamp?: string;
  readonly version?: string;
  readonly locale?: string;
}

export interface LinksDto {
  readonly self?: string;
  readonly next?: string;
  readonly previous?: string;
}
