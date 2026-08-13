import type { PermissionScope } from '../rbac';

export type TenantScope = PermissionScope;

export interface TenantContext {
  readonly tenantId?: string;
  readonly storeId?: string;
  readonly branchId?: string;
  readonly userId?: string;
  readonly scope?: TenantScope;
}

export interface TenantOwnership {
  readonly tenantId?: string;
  readonly storeId?: string;
  readonly branchId?: string;
  readonly userId?: string;
}

export interface TenantMetadata {
  readonly tenantId?: string;
  readonly storeId?: string;
  readonly branchId?: string;
  readonly userId?: string;
  readonly scope?: TenantScope;
  readonly ownership: TenantOwnership;
}

export interface TenantValidationResult {
  readonly valid: boolean;
  readonly reason: 'valid' | 'invalid_tenant' | 'invalid_store' | 'invalid_branch' | 'invalid_owner' | 'cross_tenant' | 'cross_store' | 'cross_branch';
  readonly metadata: TenantMetadata;
}

export interface TenantResolverContext {
  readonly tenantContext?: TenantContext;
  readonly requestedTenantId?: string;
  readonly requestedStoreId?: string;
  readonly requestedBranchId?: string;
  readonly requestedUserId?: string;
}
