import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  User,
  Package,
  Tags,
  Building2,
  Scale,
  ScanBarcode,
  Warehouse,
  ClipboardList,
  ArrowUpDown,
  ArrowLeftRight,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  Truck,
  Users,
  ShieldCheck,
  Settings,
  LifeBuoy,
  Info,
  Phone,
} from 'lucide-react';
import type { NavGroup } from '@/types/navigation';

/**
 * Sidebar navigation configuration with RBAC permissions and roles.
 */
export const navConfig: NavGroup[] = [
  {
    label: 'Main Menu',
    items: [
      {
        id: 'home',
        label: 'Home',
        path: '/',
        icon: Home,
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        authRequired: true,
      },
      {
        id: 'cart',
        label: 'Cart',
        path: '/cart',
        icon: ShoppingCart,
        authRequired: true,
      },
      {
        id: 'orders',
        label: 'Orders',
        path: '/orders',
        icon: Package,
        authRequired: true,
      },
      {
        id: 'profile',
        label: 'Profile',
        path: '/profile',
        icon: User,
        authRequired: true,
      },
      {
        id: 'about',
        label: 'About Us',
        path: '/about',
        icon: Info,
      },
      {
        id: 'contact',
        label: 'Contact Us',
        path: '/contact',
        icon: Phone,
      },
    ],
  },
  {
    label: 'Catalog',
    items: [
      {
        id: 'products',
        label: 'Products',
        path: '/products',
        icon: Package,
      },
      {
        id: 'categories',
        label: 'Categories',
        path: '/products/categories',
        icon: Tags,
        requiredPermission: 'products:read',
      },
      {
        id: 'brands',
        label: 'Brands',
        path: '/products/brands',
        icon: Building2,
        requiredPermission: 'products:read',
      },
      {
        id: 'units',
        label: 'Units',
        path: '/products/units',
        icon: Scale,
        requiredPermission: 'products:read',
      },
      {
        id: 'barcode',
        label: 'Barcode',
        path: '/products/barcode',
        icon: ScanBarcode,
        requiredPermission: 'products:read',
      },
    ],
  },
  {
    label: 'Inventory',
    items: [
      {
        id: 'inventoryDashboard',
        label: 'Inventory Dashboard',
        path: '/inventory',
        icon: Warehouse,
        requiredPermission: 'inventory:read',
      },
      {
        id: 'stockOverview',
        label: 'Stock Overview',
        path: '/inventory/overview',
        icon: ClipboardList,
        requiredPermission: 'inventory:read',
      },
      {
        id: 'stockMovements',
        label: 'Stock Movements',
        path: '/inventory/movements',
        icon: ArrowUpDown,
        requiredPermission: 'inventory:read',
      },
      {
        id: 'stockAdjustment',
        label: 'Stock Adjustment',
        path: '/inventory/adjustment',
        icon: ArrowLeftRight,
        requiredPermission: 'inventory:update',
      },
      {
        id: 'stockTransfer',
        label: 'Stock Transfer',
        path: '/inventory/transfer',
        icon: ArrowLeftRight,
        requiredPermission: 'inventory:update',
      },
      {
        id: 'lowStock',
        label: 'Low Stock',
        path: '/inventory/low-stock',
        icon: AlertTriangle,
        requiredPermission: 'inventory:read',
      },
      {
        id: 'outOfStock',
        label: 'Out of Stock',
        path: '/inventory/out-of-stock',
        icon: AlertCircle,
        requiredPermission: 'inventory:read',
      },
      {
        id: 'inventoryReports',
        label: 'Inventory Reports',
        path: '/inventory/reports',
        icon: BarChart3,
        requiredPermission: 'reports:read',
      },
    ],
  },
  {
    label: 'Suppliers',
    items: [
      {
        id: 'suppliersDashboard',
        label: 'Supplier Dashboard',
        path: '/suppliers',
        icon: Truck,
        requiredPermission: 'suppliers:read',
      },
      {
        id: 'suppliersList',
        label: 'Supplier List',
        path: '/suppliers/list',
        icon: Users,
        requiredPermission: 'suppliers:read',
      },
    ],
  },
  {
    label: 'System & Admin',
    items: [
      {
        id: 'users',
        label: 'Users',
        path: '/admin/users',
        icon: Users,
        requiredPermission: 'users:read',
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        path: '/admin/roles',
        icon: ShieldCheck,
        requiredPermission: 'roles:read',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Settings,
        authRequired: true,
      },
      {
        id: 'help',
        label: 'Help & Support',
        path: '/help',
        icon: LifeBuoy,
      },
    ],
  },
];

export default navConfig;


