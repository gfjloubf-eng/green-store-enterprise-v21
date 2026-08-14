import { Routes, Route } from 'react-router-dom';
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
import {
  ProductsListPage,
  CreateProductPage,
  EditProductPage,
  ProductDetailsPage,
  CategoriesPage,
  BrandsPage,
  UnitsPage,
  BarcodePage,
} from '@/features/products/pages';
import { StoreListPage, StoreProfilePage } from '@/features/marketplace/pages';
import {
  InventoryDashboard,
  StockOverview,
  StockMovements,
  StockAdjustment,
  StockTransfer,
  LowStock,
  OutOfStock,
  InventoryReports,
} from '@/features/inventory/pages';
import {
  SupplierDashboard,
  SupplierListPage,
  SupplierDetailsPage,
  CreateSupplierPage,
  EditSupplierPage,
  SupplierCategoriesPage,
  SupplierContactsPage,
  SupplierReportsPage,
} from '@/features/suppliers/pages';
import { CheckoutPage } from '@/features/checkout/pages';
import OrdersListPage from '@/features/orders/pages/OrdersListPage';
import OrderDetailsPage from '@/features/orders/pages/OrderDetailsPage';

import SupportCenterPage from '@/features/support/pages/SupportCenterPage';

export default function App() {
  return (
    <AppProviders>
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
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Customer / Authenticated Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="support" element={<SupportCenterPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requiredPermission="users:read" />}>
            <Route path="admin/users" element={<AdminUsersPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredPermission="roles:read" />}>
            <Route path="admin/roles" element={<AdminRolesPage />} />
          </Route>

          {/* Product Management Protected Routes */}
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
          </Route>

          {/* Inventory Management Protected Routes */}
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

          {/* Supplier Management Protected Routes */}
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

          {/* Marketplace / Stores */}
          <Route path="stores" element={<StoreListPage />} />
          <Route path="stores/:storeId" element={<StoreProfilePage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound404Page />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}

