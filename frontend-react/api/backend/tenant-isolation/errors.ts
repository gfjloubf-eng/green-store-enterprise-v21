export class TenantIsolationError extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, TenantIsolationError.prototype);
  }
}

export class TenantAccessDeniedError extends TenantIsolationError {
  constructor(message?: string) {
    super('tenant_access_denied', message ?? 'tenant_access_denied');
    Object.setPrototypeOf(this, TenantAccessDeniedError.prototype);
  }
}

export class InvalidTenantError extends TenantIsolationError {
  constructor(message?: string) {
    super('invalid_tenant', message ?? 'invalid_tenant');
    Object.setPrototypeOf(this, InvalidTenantError.prototype);
  }
}

export class CrossTenantAccessError extends TenantIsolationError {
  constructor(message?: string) {
    super('cross_tenant_access', message ?? 'cross_tenant_access');
    Object.setPrototypeOf(this, CrossTenantAccessError.prototype);
  }
}
