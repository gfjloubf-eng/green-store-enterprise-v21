import type { LinksDto, PaginationDto, RequestMetadataDto } from './types';

export interface SuccessResponseDto<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: RequestMetadataDto;
}

export interface ErrorResponseDto {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
  readonly meta?: RequestMetadataDto;
}

export interface PaginatedResponseDto<T> {
  readonly success: true;
  readonly data: T[];
  readonly pagination: PaginationDto;
  readonly meta?: RequestMetadataDto;
  readonly links?: LinksDto;
}

export interface CreatedResponseDto<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: RequestMetadataDto;
}

export interface UpdatedResponseDto<T> {
  readonly success: true;
  readonly data: T;
  readonly meta?: RequestMetadataDto;
}

export interface DeletedResponseDto {
  readonly success: true;
  readonly meta?: RequestMetadataDto;
}
