import type { TenantContext, TenantResolverContext, TenantValidationResult } from './types';
import { normalizeTenantContext, validateTenantContext } from './utils';

export interface TenantResolverContract {
  resolve(context?: TenantResolverContext): TenantContext;
  validate(context: TenantResolverContext): TenantValidationResult;
}

export class TenantResolver implements TenantResolverContract {
  public resolve(context?: TenantResolverContext): TenantContext {
    return normalizeTenantContext(context?.tenantContext);
  }

  public validate(context: TenantResolverContext): TenantValidationResult {
    return validateTenantContext(context);
  }
}

export default new TenantResolver();
