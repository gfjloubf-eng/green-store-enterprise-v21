import { RepositoryFactory } from '../repositories/repository-factory';
import TenantService from './tenant-service';
import UserService from './user-service';
import RoleService from './role-service';
import PermissionService from './permission-service';
import StoreService from './store-service';
import BranchService from './branch-service';
import CategoryService from './category-service';
import ProductService from './product-service';
import InventoryService from './inventory-service';
import SupplierService from './supplier-service';
import CustomerService from './customer-service';
import CartService from './cart-service';
import OrderService from './order-service';
import PaymentService from './payment-service';
import NotificationService from './notification-service';
import AuditService from './audit-service';

export const ServiceFactory = {
  createTenantService: () => new TenantService(RepositoryFactory.getTenantRepository()),
  createUserService: () => new UserService(
    RepositoryFactory.getUserRepository(),
    RepositoryFactory.getRoleRepository(),
  ),
  createRoleService: () => new RoleService(RepositoryFactory.getRoleRepository(), RepositoryFactory.getPermissionRepository()),
  createPermissionService: () => new PermissionService(RepositoryFactory.getPermissionRepository()),
  createStoreService: () => new StoreService(RepositoryFactory.getStoreRepository()),
  createBranchService: () => new BranchService(RepositoryFactory.getBranchRepository()),
  createCategoryService: () => new CategoryService(RepositoryFactory.getCategoryRepository()),
  createProductService: () => new ProductService(RepositoryFactory.getProductRepository()),
  createInventoryService: () => new InventoryService(RepositoryFactory.getInventoryRepository()),
  createSupplierService: () => new SupplierService(RepositoryFactory.getSupplierRepository()),
  createCustomerService: () => new CustomerService(RepositoryFactory.getCustomerRepository()),
  createCartService: () => new CartService(RepositoryFactory.getCartRepository()),
  createOrderService: () => new OrderService(RepositoryFactory.getOrderRepository()),
  createPaymentService: () => new PaymentService(RepositoryFactory.getPaymentRepository()),
  createNotificationService: () => new NotificationService(RepositoryFactory.getNotificationRepository()),
  createAuditService: () => new AuditService(RepositoryFactory.getAuditRepository()),
};

export default ServiceFactory;
