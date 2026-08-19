import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProviders } from '@/providers/AppProviders';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/components/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import CartPage from '@/features/cart/pages/CartPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import {
  AboutPage,
  ContactPage,
  SettingsPage,
  HelpPage,
  AdminUsersPage,
  AdminRolesPage,
  NotFound404Page,
} from '@/components/PublicPages';
import { ProductsListPage } from '@/features/products/pages/ProductsListPage';
import { ProductDetailsPage } from '@/features/products/pages/ProductDetailsPage';
import { StoreListPage, StoreProfilePage } from '@/features/marketplace/pages';
const CreateProductPage = lazy(() => import('@/features/products/pages/CreateProductPage').then((m) => ({ default: m.CreateProductPage })));
const EditProductPage = lazy(() => import('@/features/products/pages/EditProductPage').then((m) => ({ default: m.EditProductPage })));
const CategoriesPage = lazy(() => import('@/features/products/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const BrandsPage = lazy(() => import('@/features/products/pages/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const UnitsPage = lazy(() => import('@/features/products/pages/UnitsPage').then((m) => ({ default: m.UnitsPage })));
const BarcodePage = lazy(() => import('@/features/products/pages/BarcodePage').then((m) => ({ default: m.BarcodePage })));
const AdminOffersPage = lazy(() => import('@/features/products/pages/AdminOffersPage').then((m) => ({ default: m.AdminOffersPage })));

const InventoryDashboard = lazy(() => import('@/features/inventory/pages/InventoryDashboard').then((m) => ({ default: m.InventoryDashboard })));
const StockOverview = lazy(() => import('@/features/inventory/pages/StockOverview').then((m) => ({ default: m.StockOverview })));
const StockMovements = lazy(() => import('@/features/inventory/pages/StockMovements').then((m) => ({ default: m.StockMovements })));
const StockAdjustment = lazy(() => import('@/features/inventory/pages/StockAdjustment').then((m) => ({ default: m.StockAdjustment })));
const StockTransfer = lazy(() => import('@/features/inventory/pages/StockTransfer').then((m) => ({ default: m.StockTransfer })));
const LowStock = lazy(() => import('@/features/inventory/pages/LowStock').then((m) => ({ default: m.LowStock })));
const OutOfStock = lazy(() => import('@/features/inventory/pages/OutOfStock').then((m) => ({ default: m.OutOfStock })));
const InventoryReports = lazy(() => import('@/features/inventory/pages/InventoryReports').then((m) => ({ default: m.InventoryReports })));

const SupplierDashboard = lazy(() => import('@/features/suppliers/pages/SupplierDashboard').then((m) => ({ default: m.SupplierDashboard })));
const SupplierListPage = lazy(() => import('@/features/suppliers/pages/SupplierListPage').then((m) => ({ default: m.SupplierListPage })));
const SupplierDetailsPage = lazy(() => import('@/features/suppliers/pages/SupplierDetailsPage').then((m) => ({ default: m.SupplierDetailsPage })));
const CreateSupplierPage = lazy(() => import('@/features/suppliers/pages/CreateSupplierPage').then((m) => ({ default: m.CreateSupplierPage })));
const EditSupplierPage = lazy(() => import('@/features/suppliers/pages/EditSupplierPage').then((m) => ({ default: m.EditSupplierPage })));
const SupplierCategoriesPage = lazy(() => import('@/features/suppliers/pages/SupplierCategoriesPage').then((m) => ({ default: m.SupplierCategoriesPage })));
const SupplierContactsPage = lazy(() => import('@/features/suppliers/pages/SupplierContactsPage').then((m) => ({ default: m.SupplierContactsPage })));
const SupplierReportsPage = lazy(() => import('@/features/suppliers/pages/SupplierReportsPage').then((m) => ({ default: m.SupplierReportsPage })));

const PurchaseDashboard = lazy(() => import('@/features/purchasing/pages/PurchaseDashboard').then((m) => ({ default: m.PurchaseDashboard })));
const PurchaseOrders = lazy(() => import('@/features/purchasing/pages/PurchaseOrders').then((m) => ({ default: m.PurchaseOrders })));
const CreatePurchaseOrder = lazy(() => import('@/features/purchasing/pages/CreatePurchaseOrder').then((m) => ({ default: m.CreatePurchaseOrder })));
const PurchaseDetails = lazy(() => import('@/features/purchasing/pages/PurchaseDetails').then((m) => ({ default: m.PurchaseDetails })));
const GoodsReceiving = lazy(() => import('@/features/purchasing/pages/GoodsReceiving').then((m) => ({ default: m.GoodsReceiving })));
const PurchaseReturns = lazy(() => import('@/features/purchasing/pages/PurchaseReturns').then((m) => ({ default: m.PurchaseReturns })));
const PurchaseReports = lazy(() => import('@/features/purchasing/pages/PurchaseReports').then((m) => ({ default: m.PurchaseReports })));
const PurchaseAnalytics = lazy(() => import('@/features/purchasing/pages/PurchaseAnalytics').then((m) => ({ default: m.PurchaseAnalytics })));
import { CheckoutPage } from '@/features/checkout/pages';
import OrdersListPage from '@/features/orders/pages/OrdersListPage';
import OrderDetailsPage from '@/features/orders/pages/OrderDetailsPage';

import SupportCenterPage from '@/features/support/pages/SupportCenterPage';

export default function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm font-semibold text-emerald-700" dir="rtl">
            جارٍ تحميل الصفحة...
          </div>
        }
      >
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* AppShell Layout containing Public & Protected routes */}
        <Route element={<AppShell />}>
          {/* Public Routes (Accessible without login) */}
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="support" element={<SupportCenterPage />} />

          {/* Customer / Authenticated Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          {/* Admin Management Routes */}
          <Route element={<ProtectedRoute requiredPermission="users:read" />}>
            <Route path="admin/users" element={<AdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="roles:read" />}>
            <Route path="admin/roles" element={<AdminRolesPage />} />
          </Route>

          {/* Product Management Routes */}
          <Route element={<ProtectedRoute requiredPermission="products:create" />}>
            <Route path="products/create" element={<CreateProductPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="products:update" />}>
            <Route path="products/:id/edit" element={<EditProductPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="products:read" />}>
            <Route path="products/categories" element={<CategoriesPage />} />
            <Route path="products/brands" element={<BrandsPage />} />
            <Route path="products/units" element={<UnitsPage />} />
            <Route path="products/barcode" element={<BarcodePage />} />
            <Route path="products/offers" element={<AdminOffersPage />} />
          </Route>

          {/* Inventory Management Routes */}
          <Route element={<ProtectedRoute requiredPermission="inventory:read" />}>
            <Route path="inventory" element={<InventoryDashboard />} />
            <Route path="inventory/overview" element={<StockOverview />} />
            <Route path="inventory/movements" element={<StockMovements />} />
            <Route path="inventory/adjustment" element={<StockAdjustment />} />
            <Route path="inventory/transfer" element={<StockTransfer />} />
            <Route path="inventory/low-stock" element={<LowStock />} />
            <Route path="inventory/out-of-stock" element={<OutOfStock />} />
            <Route path="inventory/reports" element={<InventoryReports />} />
          </Route>

          {/* Supplier Management Routes */}
          <Route element={<ProtectedRoute requiredPermission="suppliers:read" />}>
            <Route path="suppliers" element={<SupplierDashboard />} />
            <Route path="suppliers/list" element={<SupplierListPage />} />
            <Route path="suppliers/create" element={<CreateSupplierPage />} />
            <Route path="suppliers/categories" element={<SupplierCategoriesPage />} />
            <Route path="suppliers/contacts" element={<SupplierContactsPage />} />
            <Route path="suppliers/reports" element={<SupplierReportsPage />} />
            <Route path="suppliers/:id" element={<SupplierDetailsPage />} />
            <Route path="suppliers/:id/edit" element={<EditSupplierPage />} />
          </Route>

          {/* Purchasing Management Routes */}
          <Route element={<ProtectedRoute requiredPermission="purchasing:read" />}>
            <Route path="purchasing" element={<PurchaseDashboard />} />
            <Route path="purchasing/orders" element={<PurchaseOrders />} />
            <Route path="purchasing/create" element={<CreatePurchaseOrder />} />
            <Route path="purchasing/receiving" element={<GoodsReceiving />} />
            <Route path="purchasing/returns" element={<PurchaseReturns />} />
            <Route path="purchasing/reports" element={<PurchaseReports />} />
            <Route path="purchasing/analytics" element={<PurchaseAnalytics />} />
            <Route path="purchasing/:id" element={<PurchaseDetails />} />
          </Route>

          {/* Marketplace / Stores */}
          <Route path="stores" element={<StoreListPage />} />
          <Route path="stores/:storeId" element={<StoreProfilePage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound404Page />} />
        </Route>
        </Routes>
      </Suspense>
    </AppProviders>
  );
}

