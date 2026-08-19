/* ============================================================
    Local Marketplace Mock Data
    Customer-facing store cards for the local marketplace section.
    ============================================================ */

import {
  bellPeppers,
  strawberry,
  carrots,
  placeholderImage,
} from '@/assets/images/products/productImages';

export type StoreStatus = 'open' | 'closed';

export interface StoreLocation {
  city: string;
  district?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
}

export interface StoreBranch {
  id: string;
  storeId: string;
  name: string;
  location?: StoreLocation;
  isMainBranch?: boolean;
}

export interface LocalMarketplaceStore {
  id: string;
  name: string;
  rating: number;
  distance: string;
  status: StoreStatus;
  deliveryAvailable: boolean;
  deliveryTime: string;
  deliveryCost: string;
  minimumOrder: string;
  categories: string[];
  description: string;
  workingHours: string;
  whatsappLabel: string;
  logo: string;
  coverImage: string;
  productIds: string[];
  highlight: string;
  location?: StoreLocation;
  branches?: StoreBranch[];
}

export const LOCAL_MARKETPLACE_STORES: LocalMarketplaceStore[] = [
  {
    id: 'store-1',
    name: 'متجر النخيل',
    rating: 4.8,
    distance: '1.4 كم',
    status: 'open',
    deliveryAvailable: true,
    deliveryTime: '35 - 45 دقيقة',
    deliveryCost: 'يحدد حسب المنطقة',
    minimumOrder: 'حسب الطلب',
    categories: ['خضروات', 'أعشاب', 'فاكهة'],
    description:
      'متجر النخيل يختص بتوفير المنتجات الطازجة مباشرة من المزارع المحلية مع توصيل سريع وخدمة موثوقة.',
    workingHours: '٨:٠٠ ص - ١٠:٠٠ م',
    whatsappLabel: 'واتساب المتجر',
    logo: bellPeppers,
    coverImage: strawberry,
    productIds: ['prod-001', 'prod-006', 'prod-010'],
    highlight: 'الحد الأدنى للتوصيل 35 دقيقة',
    location: {
      city: 'صنعاء',
      district: 'شارع هائل',
      address: 'اليمن، صنعاء، شارع هائل',
    },
  },
  {
    id: 'store-2',
    name: 'سوق الحديقة',
    rating: 4.6,
    distance: '2.1 كم',
    status: 'open',
    deliveryAvailable: true,
    deliveryTime: '45 - 55 دقيقة',
    deliveryCost: 'يحدد حسب المنطقة',
    minimumOrder: 'حسب الطلب',
    categories: ['فاكهة', 'ألبان', 'مشروبات'],
    description:
      'سوق الحديقة يقدم تشكيلة مميزة من المنتجات الصحية العضوية مع تغليف آمن وجودة يومية.',
    workingHours: '٩:٠٠ ص - ١١:٠٠ م',
    whatsappLabel: 'اتصل بسوق الحديقة',
    logo: carrots,
    coverImage: carrots,
    productIds: ['prod-002', 'prod-005', 'prod-009'],
    highlight: 'خضار طازج وطلب سريع',
  },
  {
    id: 'store-3',
    name: 'بيت الخضرة',
    rating: 4.4,
    distance: '3.2 كم',
    status: 'closed',
    deliveryAvailable: false,
    deliveryTime: 'غير متاح',
    deliveryCost: 'غير متاح',
    minimumOrder: 'غير متاح',
    categories: ['خضروات', 'موسمي', 'منتجات محلية'],
    description:
      'بيت الخضرة يركز على الفواكه والخضروات الموسمية الطازجة. سيعود قريبًا بخدمة أفضل.',
    workingHours: 'مغلق الآن - يفتح قريبًا',
    whatsappLabel: 'واتساب بيت الخضرة',
    logo: placeholderImage,
    coverImage: placeholderImage,
    productIds: ['prod-003', 'prod-004', 'prod-007', 'prod-008'],
    highlight: 'مغلق حاليًا، سيتم استئناف الخدمة قريبًا',
  },
];
