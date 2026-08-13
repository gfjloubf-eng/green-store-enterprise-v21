import type { Customer, CustomerAddress } from '@prisma/client';
import type { PaginationOptions, PaginatedResult } from './pagination-contract';
import type { CreateAddressDto, CreateCustomerDto, UpdateAddressDto, UpdateCustomerDto } from '../../dto/customer';

export interface CustomerRepositoryContract {
  create(data: CreateCustomerDto): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  paginate(options: PaginationOptions): Promise<PaginatedResult<Customer>>;
  update(id: string, data: UpdateCustomerDto): Promise<Customer>;
  delete(id: string): Promise<void>;
  findByUnique(field: 'customerCode' | 'email' | 'phone', value: string, excludeId?: string): Promise<Customer | null>;
  createAddress(customerId: string, data: CreateAddressDto): Promise<CustomerAddress>;
  listAddresses(customerId: string): Promise<CustomerAddress[]>;
  updateAddress(customerId: string, addressId: string, data: UpdateAddressDto): Promise<CustomerAddress>;
  deleteAddress(customerId: string, addressId: string): Promise<void>;
  findAddress(customerId: string, addressId: string): Promise<CustomerAddress | null>;
}
