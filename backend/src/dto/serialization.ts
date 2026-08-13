export interface SerializableDto {
  readonly [key: string]: unknown;
}

export interface SerializationContract<TDto extends SerializableDto> {
  readonly serialize: (dto: TDto) => Record<string, unknown>;
  readonly deserialize: (payload: Record<string, unknown>) => TDto;
}
