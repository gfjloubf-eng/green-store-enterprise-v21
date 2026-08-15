export class ValidationException extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export class ConstraintViolationError extends ValidationException {
  constructor(message?: string) {
    super('constraint_violation', message ?? 'constraint_violation');
    Object.setPrototypeOf(this, ConstraintViolationError.prototype);
  }
}

export class InvalidRequestError extends ValidationException {
  constructor(message?: string) {
    super('invalid_request', message ?? 'invalid_request');
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}
