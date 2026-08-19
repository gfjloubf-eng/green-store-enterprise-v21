/* ============================================================
   GSDS v1.0 — Navigation Types
   Green Store Design System — Enterprise UI Foundation
   ============================================================ */

import type { LucideIcon } from 'lucide-react';

/**
 * Navigation item types for the sidebar menu hierarchy.
 * Supports multi-level nesting with optional child items.
 */
export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Route path (optional for groups without a direct route) */
  path?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Nested child items */
  children?: NavItem[];
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Badge count (e.g., notification count) */
  badge?: number;
  /** Required permission (e.g. "products:read") */
  requiredPermission?: string;
  /** Required role (e.g. "ADMIN") */
  requiredRole?: string;
  /** Any of these roles may view the item */
  requiredRoles?: string[];
  /** Require authenticated user */
  authRequired?: boolean;
  /** Only visible when unauthenticated */
  publicOnly?: boolean;
}

/**
 * Route metadata attached via React Router's `handle` prop.
 * Used by BreadcrumbEngine to auto-generate breadcrumbs and page titles.
 */
export interface RouteHandle {
  /** Page title shown in Topbar */
  title?: string;
  /** Breadcrumb label override (defaults to title) */
  breadcrumb?: string;
  /** Icon for the breadcrumb segment */
  icon?: LucideIcon;
}

/**
 * Navigation group — a logical section in the sidebar.
 */
export interface NavGroup {
  /** Group label (e.g., "Main", "Management") */
  label: string;
  /** Items in this group */
  items: NavItem[];
}

/**
 * Sidebar collapse state.
 */
export type SidebarState = 'expanded' | 'collapsed';

