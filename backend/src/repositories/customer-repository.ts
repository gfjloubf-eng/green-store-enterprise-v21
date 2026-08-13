import BaseRepository from './base-repository';
import type { CustomerRepositoryContract } from './contracts/customer-repository-contract';
import type { Customer, CustomerAddress, Prisma } from '@prisma/client';
import type { CreateAddressDto, CreateCustomerDto, UpdateAddressDto, UpdateCustomerDto } from '../dto/customer';
import PrismaService from './prisma-service';

export class CustomerRepository extends BaseRepository implements CustomerRepositoryContract {
  constructor() {
    super('customer');
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.client.customer.create({
      data: {
        customerCode: data.customerCode,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone ?? null,
        email: data.email ?? null,
        status: data.status ?? 'ACTIVE',
        notes: data.notes ?? null,
      },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return this.client.customer.findFirst({ where: { id, deletedAt: null } });
  }

  async findByUnique(field: 'customerCode' | 'email' | 'phone', value: string, excludeId?: string): Promise<Customer | null> {
    return this.client.customer.findFirst({
      where: {
        [field]: value,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const current = await this.client.customer.findUnique({ where: { id } });
    if (!current || current.deletedAt) throw new Error('customer_not_found');
    return this.client.customer.update({
      where: { id },
      data: {
        ...(data.customerCode === undefined ? {} : { customerCode: data.customerCode }),
        ...(firstName === undefined ? {} : { firstName }),
        ...(lastName === undefined ? {} : { lastName }),
        ...((firstName === undefined && lastName === undefined) ? {} : {
          fullName: `${firstName ?? current.firstName} ${lastName ?? current.lastName}`.trim(),
        }),
        ...(data.phone === undefined ? {} : { phone: data.phone }),
        ...(data.email === undefined ? {} : { email: data.email }),
        ...(data.status === undefined ? {} : { status: data.status }),
        ...(data.notes === undefined ? {} : { notes: data.notes }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async paginate(options: { page?: number; limit?: number; sort?: string; order?: 'asc' | 'desc'; filters?: Record<string, unknown> }) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 25));
    const where = { AND: [{ deletedAt: null }, options.filters ?? {}] } as Prisma.CustomerWhereInput;
    const orderBy = options.sort ? { [options.sort]: options.order ?? 'asc' } : { createdAt: 'desc' as const };
    const [data, total] = await Promise.all([
      this.client.customer.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy }),
      this.client.customer.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async createAddress(customerId: string, data: CreateAddressDto): Promise<CustomerAddress> {
    return PrismaService.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerAddress.updateMany({ where: { customerId }, data: { isDefault: false } });
      }
      const address = await tx.address.create({
        data: {
          label: data.label ?? null,
          line1: data.street,
          city: data.city,
          state: data.district,
          country: data.country,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
        },
      });
      return tx.customerAddress.create({
        data: {
          customerId,
          addressId: address.id,
          label: data.label ?? null,
          recipientName: data.recipientName,
          phone: data.phone,
          country: data.country,
          city: data.city,
          district: data.district,
          street: data.street,
          building: data.building ?? null,
          floor: data.floor ?? null,
          landmark: data.landmark ?? null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          isDefault: data.isDefault ?? false,
        },
      });
    });
  }

  async listAddresses(customerId: string): Promise<CustomerAddress[]> {
    return this.client.customerAddress.findMany({ where: { customerId }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] });
  }

  async findAddress(customerId: string, addressId: string): Promise<CustomerAddress | null> {
    return this.client.customerAddress.findFirst({ where: { id: addressId, customerId } });
  }

  async updateAddress(customerId: string, addressId: string, data: UpdateAddressDto): Promise<CustomerAddress> {
    return PrismaService.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerAddress.updateMany({ where: { customerId, NOT: { id: addressId } }, data: { isDefault: false } });
      }
      const current = await tx.customerAddress.findFirst({ where: { id: addressId, customerId } });
      if (!current) throw new Error('address_not_found');
      const updated = await tx.customerAddress.update({
        where: { id: addressId },
        data: {
          ...(data.label === undefined ? {} : { label: data.label }),
          ...(data.recipientName === undefined ? {} : { recipientName: data.recipientName }),
          ...(data.phone === undefined ? {} : { phone: data.phone }),
          ...(data.country === undefined ? {} : { country: data.country }),
          ...(data.city === undefined ? {} : { city: data.city }),
          ...(data.district === undefined ? {} : { district: data.district }),
          ...(data.street === undefined ? {} : { street: data.street }),
          ...(data.building === undefined ? {} : { building: data.building }),
          ...(data.floor === undefined ? {} : { floor: data.floor }),
          ...(data.landmark === undefined ? {} : { landmark: data.landmark }),
          ...(data.latitude === undefined ? {} : { latitude: data.latitude }),
          ...(data.longitude === undefined ? {} : { longitude: data.longitude }),
          ...(data.isDefault === undefined ? {} : { isDefault: data.isDefault }),
        },
      });
      await tx.address.update({
        where: { id: current.addressId },
        data: {
          ...(data.label === undefined ? {} : { label: data.label }),
          ...(data.street === undefined ? {} : { line1: data.street }),
          ...(data.city === undefined ? {} : { city: data.city }),
          ...(data.district === undefined ? {} : { state: data.district }),
          ...(data.country === undefined ? {} : { country: data.country }),
          ...(data.latitude === undefined ? {} : { latitude: data.latitude }),
          ...(data.longitude === undefined ? {} : { longitude: data.longitude }),
        },
      });
      return updated;
    });
  }

  async deleteAddress(customerId: string, addressId: string): Promise<void> {
    const address = await this.client.customerAddress.findFirst({ where: { id: addressId, customerId } });
    if (!address) throw new Error('address_not_found');
    await this.client.customerAddress.delete({ where: { id: addressId } });
  }
}

export default CustomerRepository;
