export interface PublicSettingsDto {
  readonly storeName: string;
  readonly storeDescription: string;
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly supportPhone: string;
  readonly address: string;
  readonly currency: string;
  readonly taxPercentage: number;
  readonly defaultShippingFee: number;
}

export interface UpdateSettingsDto {
  readonly storeName?: string;
  readonly storeDescription?: string;
  readonly contactEmail?: string;
  readonly contactPhone?: string;
  readonly supportPhone?: string;
  readonly address?: string;
  readonly currency?: string;
  readonly taxPercentage?: number;
  readonly defaultShippingFee?: number;
  readonly maintenanceMode?: boolean;
  readonly allowGuestCheckout?: boolean;
}
