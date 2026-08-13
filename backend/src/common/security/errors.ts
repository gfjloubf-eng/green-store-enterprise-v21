export class AuthError extends Error {
  public readonly code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message?: string) {
    super('unauthorized', message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message?: string) {
    super('invalid_token', message);
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class RateLimitError extends AuthError {
  constructor(message?: string) {
    super('rate_limited', message);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class AccountLockedError extends AuthError {
  constructor(message?: string) {
    super('account_locked', message);
    Object.setPrototypeOf(this, AccountLockedError.prototype);
  }
}