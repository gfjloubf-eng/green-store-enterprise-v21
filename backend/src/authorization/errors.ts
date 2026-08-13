export class AuthorizationError extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class UnauthorizedError extends AuthorizationError {
  constructor(message?: string) {
    super('unauthorized', message ?? 'unauthorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AuthorizationError {
  constructor(message?: string) {
    super('forbidden', message ?? 'forbidden');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class PermissionDeniedError extends ForbiddenError {
  constructor(message?: string) {
    super(message ?? 'permission_denied');
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

export class RoleDeniedError extends ForbiddenError {
  constructor(message?: string) {
    super(message ?? 'role_denied');
    Object.setPrototypeOf(this, RoleDeniedError.prototype);
  }
}
