import type { CreateAddressDto, CreateCustomerDto, UpdateAddressDto, UpdateCustomerDto } from '../dto/customer';

export interface CustomerServiceContract {
  create(data: CreateCustomerDto): Promise<unknown>;
  findById(id: string): Promise<unknown | null>;
  update(id: string, data: UpdateCustomerDto): Promise<unknown>;
  delete(id: string): Promise<void>;
  paginate(options: { page?: number; limit?: number; sort?: string; order?: 'asc' | 'desc'; filters?: Record<string, unknown> }): Promise<unknown>;
  createAddress(customerId: string, data: CreateAddressDto): Promise<unknown>;
  listAddresses(customerId: string): Promise<unknown>;
  updateAddress(customerId: string, addressId: string, data: UpdateAddressDto): Promise<unknown>;
  deleteAddress(customerId: string, addressId: string): Promise<void>;
}
