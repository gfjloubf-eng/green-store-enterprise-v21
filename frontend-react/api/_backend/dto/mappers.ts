export interface EntityToDtoMapper<TDto, TEntity> {
  readonly mapToDto: (entity: TEntity) => TDto;
}

export interface DtoToEntityMapper<TEntity, TDto> {
  readonly mapToEntity: (dto: TDto) => TEntity;
}

export interface BidirectionalMapper<TDto, TEntity> extends EntityToDtoMapper<TDto, TEntity>, DtoToEntityMapper<TEntity, TDto> {}
