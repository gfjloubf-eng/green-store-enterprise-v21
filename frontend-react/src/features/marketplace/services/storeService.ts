import { LOCAL_MARKETPLACE_STORES, type LocalMarketplaceStore } from '@/config/localMarketplace';

export class StoreService {
  static getAll(): LocalMarketplaceStore[] {
    return [...LOCAL_MARKETPLACE_STORES];
  }

  static getOpen(): LocalMarketplaceStore[] {
    return LOCAL_MARKETPLACE_STORES.filter((store) => store.status === 'open');
  }

  static getById(id: string): LocalMarketplaceStore | undefined {
    return LOCAL_MARKETPLACE_STORES.find((store) => store.id === id);
  }
}
