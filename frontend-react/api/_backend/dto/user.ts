export interface CreateUserDto {
  readonly email: string;
  readonly displayName?: string | null;
  readonly phone?: string | null;
  readonly password?: string; // accepted on create but never returned
}

export interface UpdateUserDto {
  readonly displayName?: string | null;
  readonly phone?: string | null;
  readonly isActive?: boolean;
}

export interface UserResponseDto {
  readonly id: string;
  readonly fullName?: string | null;
  readonly email: string;
  readonly phone?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string | null;
}
