import { PERMISSION_DEFINITIONS } from '../rbac';
import AuthorizationService from './service';
import type { AuthorizationContext, AuthorizationResult } from './types';

const usersUpdatePermission = PERMISSION_DEFINITIONS.users.update.key;
const productPermissions = [
  PERMISSION_DEFINITIONS.products.create.key,
  PERMISSION_DEFINITIONS.products.update.key,
  PERMISSION_DEFINITIONS.products.delete.key,
] as const;
const orderPermissions = [
  PERMISSION_DEFINITIONS.orders.create.key,
  PERMISSION_DEFINITIONS.orders.update.key,
  PERMISSION_DEFINITIONS.orders.delete.key,
] as const;
const reportsReadPermission = PERMISSION_DEFINITIONS.reports.read.key;
const inventoryPermissions = [
  PERMISSION_DEFINITIONS.inventory.create.key,
  PERMISSION_DEFINITIONS.inventory.update.key,
  PERMISSION_DEFINITIONS.inventory.delete.key,
] as const;

export function canManageUsers(context: AuthorizationContext, service = AuthorizationService): AuthorizationResult {
  return service.can(context, usersUpdatePermission, { requiredScope: 'tenant' });
}

export function canManageProducts(context: AuthorizationContext, service = AuthorizationService): AuthorizationResult {
  return service.hasAnyPermission(context, [...productPermissions], { requiredScope: 'tenant' });
}

export function canManageOrders(context: AuthorizationContext, service = AuthorizationService): AuthorizationResult {
  return service.hasAnyPermission(context, [...orderPermissions], { requiredScope: 'tenant' });
}

export function canViewReports(context: AuthorizationContext, service = AuthorizationService): AuthorizationResult {
  return service.can(context, reportsReadPermission, { requiredScope: 'tenant' });
}

export function canManageInventory(context: AuthorizationContext, service = AuthorizationService): AuthorizationResult {
  return service.hasAnyPermission(context, [...inventoryPermissions], { requiredScope: 'tenant' });
}
