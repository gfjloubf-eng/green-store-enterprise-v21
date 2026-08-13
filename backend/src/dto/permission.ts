export type PermissionActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LIST' | 'EXECUTE';

export interface CreatePermissionDto {
  resource: string;
  action: PermissionActionType;
  description?: string | null;
}

export interface UpdatePermissionDto {
  resource?: string;
  action?: PermissionActionType;
  description?: string | null;
}

export interface PermissionResponseDto {
  id: string;
  name: string;
  resource: string;
  action: PermissionActionType;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
