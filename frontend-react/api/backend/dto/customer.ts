export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface CreateCustomerDto {
  customerCode: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;

export interface CustomerResponseDto {
  id: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateAddressDto {
  label?: string | null;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  street: string;
  building?: string | null;
  floor?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface AddressResponseDto extends CreateAddressDto {
  id: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}
