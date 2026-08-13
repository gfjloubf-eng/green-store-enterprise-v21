import type { CustomerServiceContract } from './customer-service-contract';
import type { CustomerRepositoryContract } from '../repositories/contracts/customer-repository-contract';
import BaseService from './base-service';
import { ConflictException, NotFoundException } from '../repositories/exceptions';
import { ValidationException } from '../validation';
import type { CreateAddressDto, CreateCustomerDto, UpdateAddressDto, UpdateCustomerDto } from '../dto/customer';

export class CustomerService extends BaseService implements CustomerServiceContract {
  constructor(private readonly customerRepo: CustomerRepositoryContract) {
    super();
  }

  async create(data: CreateCustomerDto) {
    this.validateCustomer(data, false);
    for (const field of ['customerCode', 'email', 'phone'] as const) {
      const value = data[field];
      if (value && await this.customerRepo.findByUnique(field, value)) throw new ConflictException(`${field}_already_exists`);
    }
    try {
      return await this.customerRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async findById(id: string) {
    return this.customerRepo.findById(id);
  }

  async update(id: string, data: UpdateCustomerDto) {
    if (!this.isUuid(id)) throw new ValidationException('customer_id_invalid');
    const current = await this.customerRepo.findById(id);
    if (!current) throw new NotFoundException('customer_not_found');
    this.validateCustomer({ ...current, ...data } as CreateCustomerDto, true);
    for (const field of ['customerCode', 'email', 'phone'] as const) {
      const value = data[field];
      if (value && await this.customerRepo.findByUnique(field, value, id)) throw new ConflictException(`${field}_already_exists`);
    }
    try {
      return await this.customerRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }

  async delete(id: string): Promise<void> {
    if (!this.isUuid(id)) throw new ValidationException('customer_id_invalid');
    if (!(await this.customerRepo.findById(id))) throw new NotFoundException('customer_not_found');
    await this.customerRepo.delete(id);
  }

  async paginate(options: { page?: number; limit?: number; sort?: string; order?: 'asc' | 'desc'; filters?: Record<string, unknown> }) {
    return this.customerRepo.paginate(options);
  }

  async createAddress(customerId: string, data: CreateAddressDto) {
    await this.requireCustomer(customerId);
    this.validateAddress(data);
    return this.customerRepo.createAddress(customerId, data);
  }

  async listAddresses(customerId: string) {
    await this.requireCustomer(customerId);
    return this.customerRepo.listAddresses(customerId);
  }

  async updateAddress(customerId: string, addressId: string, data: UpdateAddressDto) {
    await this.requireCustomer(customerId);
    if (!this.isUuid(addressId)) throw new ValidationException('address_id_invalid');
    const current = await this.customerRepo.findAddress(customerId, addressId);
    if (!current) throw new NotFoundException('address_not_found');
    this.validateAddress({ ...current, ...data } as CreateAddressDto);
    return this.customerRepo.updateAddress(customerId, addressId, data);
  }

  async deleteAddress(customerId: string, addressId: string) {
    await this.requireCustomer(customerId);
    if (!this.isUuid(addressId)) throw new ValidationException('address_id_invalid');
    if (!(await this.customerRepo.findAddress(customerId, addressId))) throw new NotFoundException('address_not_found');
    await this.customerRepo.deleteAddress(customerId, addressId);
  }

  private async requireCustomer(id: string) {
    if (!this.isUuid(id)) throw new ValidationException('customer_id_invalid');
    if (!(await this.customerRepo.findById(id))) throw new NotFoundException('customer_not_found');
  }

  private validateCustomer(data: CreateCustomerDto, allowPartial: boolean): void {
    if (!data || typeof data !== 'object') throw new ValidationException('customer_required');
    if (!allowPartial && (!data.customerCode || !data.firstName || !data.lastName)) throw new ValidationException('customer_name_required');
    if (data.customerCode !== undefined && (!this.text(data.customerCode, 2, 64) || !/^[A-Za-z0-9_-]+$/.test(data.customerCode))) throw new ValidationException('customer_code_invalid');
    if (data.firstName !== undefined && !this.text(data.firstName, 1, 100)) throw new ValidationException('first_name_invalid');
    if (data.lastName !== undefined && !this.text(data.lastName, 1, 100)) throw new ValidationException('last_name_invalid');
    if (data.email !== undefined && data.email !== null && (!this.text(data.email, 3, 255) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) throw new ValidationException('email_invalid');
    if (data.phone !== undefined && data.phone !== null && (!this.text(data.phone, 7, 32) || !/^\+?[0-9 ()-]+$/.test(data.phone))) throw new ValidationException('phone_invalid');
    if (data.status !== undefined && !['ACTIVE', 'INACTIVE', 'BLOCKED'].includes(data.status)) throw new ValidationException('status_invalid');
    if (data.notes !== undefined && data.notes !== null && !this.text(data.notes, 0, 2000)) throw new ValidationException('notes_invalid');
  }

  private validateAddress(data: CreateAddressDto): void {
    for (const field of ['recipientName', 'phone', 'country', 'city', 'district', 'street'] as const) {
      if (!this.text(data[field], field === 'phone' ? 7 : 1, field === 'phone' ? 32 : 255)) throw new ValidationException(`${field}_invalid`);
    }
    if (!/^\+?[0-9 ()-]+$/.test(data.phone)) throw new ValidationException('phone_invalid');
    if (data.latitude !== undefined && data.latitude !== null && (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90)) throw new ValidationException('latitude_invalid');
    if (data.longitude !== undefined && data.longitude !== null && (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180)) throw new ValidationException('longitude_invalid');
  }

  private text(value: unknown, min: number, max: number): value is string {
    return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}

export default CustomerService;