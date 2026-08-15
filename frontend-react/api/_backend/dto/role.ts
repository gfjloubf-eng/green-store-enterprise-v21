export interface CreateRoleDto {
  name: string;
  displayName?: string | null;
  description?: string | null;
  isSystem?: boolean;
}

export interface UpdateRoleDto {
  displayName?: string | null;
  description?: string | null;
  isSystem?: boolean;
}

export interface RoleResponseDto {
  id: string;
  name: string;
  displayName: string | null;
  description: string | null;
  isSystem: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AssignPermissionDto {
  permissionId: string;
}

export interface RolePermissionResponseDto {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: string;
  permission: {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string | null;
  } | null;
}

export interface RolePermissionsResponseDto {
  role: RoleResponseDto;
  permissions: RolePermissionResponseDto[];
}
