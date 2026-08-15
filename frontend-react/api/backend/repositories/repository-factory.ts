import TenantRepository from './tenant-repository';
import UserRepository from './user-repository';
import RoleRepository from './role-repository';
import PermissionRepository from './permission-repository';
import StoreRepository from './store-repository';
import BranchRepository from './branch-repository';
import CategoryRepository from './category-repository';
import ProductRepository from './product-repository';
import InventoryRepository from './inventory-repository';
import SupplierRepository from './supplier-repository';
import CustomerRepository from './customer-repository';
import CartRepository from './cart-repository';
import OrderRepository from './order-repository';
import PaymentRepository from './payment-repository';
import NotificationRepository from './notification-repository';
import AuditRepository from './audit-repository';

// Singletons for application use. Factories return contracts (class instances implement contracts).
const tenantRepository = new TenantRepository();
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const storeRepository = new StoreRepository();
const branchRepository = new BranchRepository();
const categoryRepository = new CategoryRepository();
const productRepository = new ProductRepository();
const inventoryRepository = new InventoryRepository();
const supplierRepository = new SupplierRepository();
const customerRepository = new CustomerRepository();
const cartRepository = new CartRepository();
const orderRepository = new OrderRepository();
const paymentRepository = new PaymentRepository();
const notificationRepository = new NotificationRepository();
const auditRepository = new AuditRepository();

export const RepositoryFactory = {
  getTenantRepository: () => tenantRepository,
  getUserRepository: () => userRepository,
  getRoleRepository: () => roleRepository,
  getPermissionRepository: () => permissionRepository,
  getStoreRepository: () => storeRepository,
  getBranchRepository: () => branchRepository,
  getCategoryRepository: () => categoryRepository,
  getProductRepository: () => productRepository,
  getInventoryRepository: () => inventoryRepository,
  getSupplierRepository: () => supplierRepository,
  getCustomerRepository: () => customerRepository,
  getCartRepository: () => cartRepository,
  getOrderRepository: () => orderRepository,
  getPaymentRepository: () => paymentRepository,
  getNotificationRepository: () => notificationRepository,
  getAuditRepository: () => auditRepository,
};

export default RepositoryFactory;
