export interface CreateRequestDto<TBody = unknown> {
  readonly data: TBody;
}

export interface UpdateRequestDto<TBody = unknown> {
  readonly data: Partial<TBody>;
}

export interface DeleteRequestDto {
  readonly id: string;
}

export interface RestoreRequestDto {
  readonly id: string;
}

export interface BulkRequestDto<TBody = unknown> {
  readonly items: TBody[];
}
