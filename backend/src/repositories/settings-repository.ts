import BaseRepository from './base-repository';
import { ValidationException } from '../validation';

export const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: 'قطوف الطبيعة (Qutoof Nature Store)',
  store_description: 'متجر التمور والفواكه والمواد الغذائية الطازجة',
  contact_email: 'support@qutoof.sa',
  contact_phone: '+967712275038',
  support_phone: '+967777803161',
  address: 'اليمن — يحدد العنوان عند تأكيد الطلب',
  currency: 'YER',
  tax_percentage: '15',
  shipping_fee_default: '0',
  maintenance_mode: 'false',
  allow_guest_checkout: 'true',
};

const FORBIDDEN_KEYS = ['JWT_SECRET', 'DATABASE_URL', 'API_KEY', 'PASSWORD', 'SECRET', 'TOKEN', 'PRIVATE_KEY'];

export class SettingsRepository extends BaseRepository {
  constructor() {
    super('systemSetting');
  }

  async getSetting(key: string, fallback?: string): Promise<string> {
    const record = await this.client.systemSetting.findUnique({
      where: { key },
    });
    return record?.value ?? fallback ?? DEFAULT_SETTINGS[key] ?? '';
  }

  async getPublicSettings() {
    const all = await this.getAllSettings();
    return {
      storeName: all.store_name ?? DEFAULT_SETTINGS.store_name,
      storeDescription: all.store_description ?? DEFAULT_SETTINGS.store_description,
      contactEmail: all.contact_email ?? DEFAULT_SETTINGS.contact_email,
      contactPhone: all.contact_phone ?? DEFAULT_SETTINGS.contact_phone,
      supportPhone: all.support_phone ?? DEFAULT_SETTINGS.support_phone,
      address: all.address ?? DEFAULT_SETTINGS.address,
      currency: all.currency ?? DEFAULT_SETTINGS.currency,
      taxPercentage: Number(all.tax_percentage ?? DEFAULT_SETTINGS.tax_percentage),
      defaultShippingFee: Number(all.shipping_fee_default ?? DEFAULT_SETTINGS.shipping_fee_default),
    };
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const records = await this.client.systemSetting.findMany();
    const result: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const r of records) {
      result[r.key] = r.value;
    }
    return result;
  }

  async updateSettings(updates: Record<string, string>): Promise<Record<string, string>> {
    for (const key of Object.keys(updates)) {
      const upperKey = key.toUpperCase();
      if (FORBIDDEN_KEYS.some((fk) => upperKey.includes(fk))) {
        throw new ValidationException(`forbidden_setting_key_${key}`);
      }
    }

    // Validate Tax Percentage range (0-100) if passed
    if (updates.tax_percentage !== undefined) {
      const tax = Number(updates.tax_percentage);
      if (isNaN(tax) || tax < 0 || tax > 100) {
        throw new ValidationException('invalid_tax_percentage');
      }
    }

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === null) continue;
      await this.client.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return this.getAllSettings();
  }
}

export default SettingsRepository;
