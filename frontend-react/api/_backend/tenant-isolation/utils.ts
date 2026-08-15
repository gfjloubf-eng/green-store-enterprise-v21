import type { TenantContext, TenantMetadata, TenantOwnership, TenantResolverContext, TenantValidationResult } from './types';

export function normalizeTenantContext(context?: Partial<TenantContext>): TenantContext {
  return {
    tenantId: context?.tenantId,
    storeId: context?.storeId,
    branchId: context?.branchId,
    userId: context?.userId,
    scope: context?.scope,
  };
}

export function isSameTenant(a?: string, b?: string): boolean {
  return Boolean(a && b && a === b);
}

export function isSameStore(a?: string, b?: string): boolean {
  return Boolean(a && b && a === b);
}

export function isSameBranch(a?: string, b?: string): boolean {
  return Boolean(a && b && a === b);
}

export function resolveOwnership(context?: Partial<TenantContext>): TenantOwnership {
  return {
    tenantId: context?.tenantId,
    storeId: context?.storeId,
    branchId: context?.branchId,
    userId: context?.userId,
  };
}

export function createTenantMetadata(context: TenantContext): TenantMetadata {
  return {
    tenantId: context.tenantId,
    storeId: context.storeId,
    branchId: context.branchId,
    userId: context.userId,
    scope: context.scope,
    ownership: resolveOwnership(context),
  };
}

export function validateTenantContext(context: TenantResolverContext): TenantValidationResult {
  const normalized = normalizeTenantContext(context.tenantContext);
  const metadata = createTenantMetadata(normalized);

  if (!normalized.tenantId) {
    return { valid: false, reason: 'invalid_tenant', metadata };
  }

  if (context.requestedTenantId && !isSameTenant(normalized.tenantId, context.requestedTenantId)) {
    return { valid: false, reason: 'cross_tenant', metadata };
  }

  if (context.requestedStoreId && !isSameStore(normalized.storeId, context.requestedStoreId)) {
    return { valid: false, reason: 'cross_store', metadata };
  }

  if (context.requestedBranchId && !isSameBranch(normalized.branchId, context.requestedBranchId)) {
    return { valid: false, reason: 'cross_branch', metadata };
  }

  if (context.requestedUserId && !isSameTenant(normalized.userId, context.requestedUserId)) {
    return { valid: false, reason: 'invalid_owner', metadata };
  }

  return { valid: true, reason: 'valid', metadata };
}
