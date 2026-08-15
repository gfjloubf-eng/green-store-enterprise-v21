import { TenantAccessDeniedError, CrossTenantAccessError, InvalidTenantError } from './errors';
import type { TenantContext, TenantValidationResult } from './types';
import { validateTenantContext } from './utils';

export interface TenantBoundaryContract {
  enforce(context: { tenantContext?: TenantContext; requestedTenantId?: string; requestedStoreId?: string; requestedBranchId?: string; requestedUserId?: string }): TenantValidationResult;
}

export class TenantBoundary implements TenantBoundaryContract {
  public enforce(context: { tenantContext?: TenantContext; requestedTenantId?: string; requestedStoreId?: string; requestedBranchId?: string; requestedUserId?: string }): TenantValidationResult {
    const result = validateTenantContext(context);
    if (!result.valid) {
      this.throwFor(result.reason);
    }
    return result;
  }

  private throwFor(reason: TenantValidationResult['reason']): never {
    switch (reason) {
      case 'invalid_tenant':
        throw new InvalidTenantError();
      case 'cross_tenant':
        throw new CrossTenantAccessError();
      default:
        throw new TenantAccessDeniedError();
    }
  }
}

export default new TenantBoundary();
