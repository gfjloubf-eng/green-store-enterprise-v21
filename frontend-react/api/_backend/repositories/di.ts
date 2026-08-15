import type { TenantRepositoryContract } from './contracts/tenant-repository-contract';
import type { UserRepositoryContract } from './contracts/user-repository-contract';
import type { RoleRepositoryContract } from './contracts/role-repository-contract';
import type { PermissionRepositoryContract } from './contracts/permission-repository-contract';
import type { StoreRepositoryContract } from './contracts/store-repository-contract';
import type { BranchRepositoryContract } from './contracts/branch-repository-contract';
import type { CategoryRepositoryContract } from './contracts/category-repository-contract';
import type { ProductRepositoryContract } from './contracts/product-repository-contract';
import type { InventoryRepositoryContract } from './contracts/inventory-repository-contract';
import type { SupplierRepositoryContract } from './contracts/supplier-repository-contract';
import type { CustomerRepositoryContract } from './contracts/customer-repository-contract';
import type { OrderRepositoryContract } from './contracts/order-repository-contract';
import type { PaymentRepositoryContract } from './contracts/payment-repository-contract';
import type { NotificationRepositoryContract } from './contracts/notification-repository-contract';
import type { AuditRepositoryContract } from './contracts/audit-repository-contract';

export interface RepositoryBindings {
  tenantRepository: TenantRepositoryContract;
  userRepository: UserRepositoryContract;
  roleRepository: RoleRepositoryContract;
  permissionRepository: PermissionRepositoryContract;
  storeRepository: StoreRepositoryContract;
  branchRepository: BranchRepositoryContract;
  categoryRepository: CategoryRepositoryContract;
  productRepository: ProductRepositoryContract;
  inventoryRepository: InventoryRepositoryContract;
  supplierRepository: SupplierRepositoryContract;
  customerRepository: CustomerRepositoryContract;
  orderRepository: OrderRepositoryContract;
  paymentRepository: PaymentRepositoryContract;
  notificationRepository: NotificationRepositoryContract;
  auditRepository: AuditRepositoryContract;
}
