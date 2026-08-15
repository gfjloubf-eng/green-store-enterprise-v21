export interface SignUpRequestDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword?: string;
  readonly phone?: string;
}

export interface ChangePasswordRequestDto {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword?: string;
}

export interface ForgotPasswordRequestDto {
  readonly email: string;
}

export interface ResetPasswordRequestDto {
  readonly token: string;
  readonly newPassword: string;
  readonly confirmPassword?: string;
}

export interface UpdateProfileRequestDto {
  readonly name?: string;
  readonly displayName?: string;
  readonly phone?: string;
}

export interface SignInRequestDto {
  readonly identifier: string;
  readonly password: string;
  readonly deviceId?: string;
}

export interface RefreshTokenRequestDto {
  readonly refreshToken: string;
}

export interface SignOutRequestDto {
  readonly refreshToken: string;
}

export interface AuthResponseDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly user?: CurrentUserDto;
}

export interface ValidateResponseDto {
  readonly valid: boolean;
}

export interface CurrentUserDto {
  readonly id: string;
  readonly fullName?: string | null;
  readonly email: string;
  readonly phone?: string | null;
  readonly avatar?: string | null;
  readonly role?: string | null;
  readonly permissions?: Array<{ resource: string; action: string }> | string[];
  readonly tenant?: { id: string; name?: string | null; slug?: string | null } | null;
  readonly store?: { id: string; name?: string | null } | null;
  readonly branch?: { id: string; name?: string | null } | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

