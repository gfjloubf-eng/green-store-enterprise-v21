import { conflict, created, forbidden, noContent, notFound, paginated, success, validationError, HTTP_STATUS } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { ConflictException, NotFoundException } from '../../repositories/exceptions';
import { ServiceFactory } from '../../services/service-factory';
import { ValidationException } from '../../validation';
import type { AddressResponseDto, CreateAddressDto, CreateCustomerDto, CustomerResponseDto, UpdateAddressDto, UpdateCustomerDto } from '../../dto/customer';
import type { Customer, CustomerAddress } from '@prisma/client';

export class CustomersController {
  private readonly service = ServiceFactory.createCustomerService();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  private value(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  private mapCustomer(entity: Customer): CustomerResponseDto {
    return {
      id: entity.id,
      customerCode: entity.customerCode,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      phone: entity.phone,
      email: entity.email,
      status: entity.status,
      notes: entity.notes,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      deletedAt: entity.deletedAt?.toISOString() ?? null,
    };
  }

  private mapAddress(entity: CustomerAddress): AddressResponseDto {
    return {
      id: entity.id,
      customerId: entity.customerId,
      label: entity.label,
      recipientName: entity.recipientName,
      phone: entity.phone,
      country: entity.country,
      city: entity.city,
      district: entity.district,
      street: entity.street,
      building: entity.building,
      floor: entity.floor,
      landmark: entity.landmark,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  async list(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    const query = request.query ?? {};
    try {
      const page = this.integer(this.value(query.page), 1, 100000);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const sort = this.value(query.sort);
      const order = this.value(query.order);
      const allowedSorts = ['id', 'customerCode', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'status', 'createdAt', 'updatedAt'];
      if (sort && !allowedSorts.includes(sort)) throw new ValidationException('sort_invalid');
      if (order && order !== 'asc' && order !== 'desc') throw new ValidationException('order_invalid');
      const filters = this.parseFilters(this.value(query.filters));
      const search = this.value(query.search)?.trim();
      if (search && search.length > 255) throw new ValidationException('search_too_long');
      const where = search
        ? { AND: [filters, { OR: [{ customerCode: { contains: search } }, { firstName: { contains: search } }, { lastName: { contains: search } }, { fullName: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] }] }
        : filters;
      const result = await this.service.paginate({ page, limit, sort, order: order as 'asc' | 'desc' | undefined, filters: where });
      return paginated(result.data.map((entry) => this.mapCustomer(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  private async checkOwnershipOrAdmin(request: ControllerRequest, targetCustomerId: string): Promise<boolean> {
    const user = request.context?.user;
    if (!user) return true;

    const userRoles: string[] = (user.roles || []).map((r: any) =>
      typeof r === 'string' ? r : r.name || r.role?.name || ''
    ).filter(Boolean);

    const isElevated = userRoles.some((role: string) =>
      ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'].includes(role.toUpperCase())
    );
    if (isElevated) return true;

    const customer = await this.service.findById(targetCustomerId);
    if (!customer) return false;

    return customer.userId === user.id || customer.id === user.id;
  }

  async get(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      const entity = await this.service.findById(id);
      return entity ? success(this.mapCustomer(entity), ctx) : notFound('customer_not_found', ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async create(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const entity = await this.service.create(request.body as CreateCustomerDto);
      return created(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async update(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      const entity = await this.service.update(id, request.body as UpdateCustomerDto);
      return success(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async remove(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      await this.service.delete(id);
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async listAddresses(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      const addresses = await this.service.listAddresses(id);
      return success(addresses.map((entry) => this.mapAddress(entry)), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async createAddress(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      const address = await this.service.createAddress(id, request.body as CreateAddressDto);
      return created(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async updateAddress(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      const address = await this.service.updateAddress(id, request.params?.addressId ?? '', request.body as UpdateAddressDto);
      return success(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async removeAddress(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const id = request.params?.id ?? '';
      const allowed = await this.checkOwnershipOrAdmin(request, id);
      if (!allowed) return forbidden('authorization_denied', ctx);
      await this.service.deleteAddress(id, request.params?.addressId ?? '');
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  private parseFilters(raw: string | undefined): Record<string, unknown> {
    if (!raw) return {};
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { throw new ValidationException('filters_invalid'); }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new ValidationException('filters_invalid');
    const allowed = ['customerCode', 'firstName', 'lastName', 'email', 'phone', 'status'];
    for (const [key, value] of Object.entries(parsed)) {
      if (!allowed.includes(key) || typeof value !== 'string' || !value.trim()) throw new ValidationException('filter_invalid');
    }
    return parsed as Record<string, unknown>;
  }

  private integer(value: string | undefined, fallback: number, max: number): number {
    if (value === undefined) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException('pagination_invalid');
    return parsed;
  }

  private error(error: unknown, ctx: ReturnType<CustomersController['context']>): ApiResponse<unknown> {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException) return notFound(error.message, ctx);
    if (error instanceof ConflictException) return conflict(error.message, ctx);
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: 'internal_error', message: 'internal_error' }, meta: ctx } };
  }
}

export default CustomersController;
