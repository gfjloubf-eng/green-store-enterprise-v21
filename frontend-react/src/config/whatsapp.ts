/* ============================================================
   GSDS v1.3 — WhatsApp Centralized Dual Ordering Configuration
   Green Store Enterprise v2 — Real Produce Intelligence Phase
   ============================================================
   Centralized source of truth for store WhatsApp numbers & messages.
   Supports dual ordering channels:
   1. Store Official Number (المتجر الرسمي)
   2. Saqr Anwar Support Number (صقر أنور - متابعة الطلبات)
   ============================================================ */

import { formatPrice } from '@/lib/formatters';

export type WhatsAppTarget = 'store' | 'saqr';

export interface WhatsAppContactInfo {
  id: WhatsAppTarget;
  name: string;
  shortName: string;
  phone: string;
  fullNumber: string;
  role: string;
}

export const WHATSAPP_CONTACTS: Record<WhatsAppTarget, WhatsAppContactInfo> = {
  store: {
    id: 'store',
    name: 'عمار عادل المصوعي — الطلب الرئيسي',
    shortName: 'عمار عادل',
    phone: '712275038',
    fullNumber: '967712275038',
    role: 'استقبال الطلبات الرئيسية وخدمة العملاء',
  },
  saqr: {
    id: 'saqr',
    name: 'صقر أنور (متابعة الطلبات والدعم)',
    shortName: 'صقر أنور',
    phone: '777803161',
    fullNumber: '967777803161',
    role: 'متابعة الطلبات وتنسيق التوصيل',
  },
} as const;

export const WHATSAPP_CONFIG = {
  countryCode: '+967',
  defaultTarget: 'store' as WhatsAppTarget,
  contacts: WHATSAPP_CONTACTS,
} as const;

export const WHATSAPP_NUMBER = `+967${WHATSAPP_CONTACTS.store.phone}`;

/**
 * Builds a direct wa.me link for a given target and message
 */
export function buildWhatsAppTargetUrl(target: WhatsAppTarget = 'store', message: string): string {
  const contact = WHATSAPP_CONTACTS[target] || WHATSAPP_CONTACTS.store;
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${contact.fullNumber}&text=${encodedMessage}`;
}

/**
 * Friendly greeting that identifies the selected WhatsApp channel.
 * The order/cart details are appended by the caller after this greeting.
 */
export function buildWhatsAppWelcomeMessage(target: WhatsAppTarget = 'store'): string {
  if (target === 'saqr') {
    return [
      'السلام عليكم ورحمة الله وبركاته 🌿',
      'مرحبًا بك في قطوف الطبيعة، معك صقر أنور لمتابعة الطلبات وتنسيق التوصيل.',
      'أرسل رقم طلبك أو استفسارك وسأتابع معك بإذن الله.',
    ].join('\\n');
  }

  return [
    'السلام عليكم ورحمة الله وبركاته 🌿',
    'مرحبًا بك في قطوف الطبيعة، معك عمار عادل لاستقبال طلبك الرئيسي.',
    'أرسل تفاصيل طلبك وسنساعدك في تأكيده وترتيب التوصيل.',
  ].join('\\n');
}

/**
 * Legacy compatibility wrapper for buildWhatsAppUrl
 */
export function buildWhatsAppUrl(message: string): string {
  return buildWhatsAppTargetUrl('store', message);
}

/**
 * Formats a single product order message for WhatsApp
 */
export function buildSingleProductWhatsAppMessage(
  product: { name: string; sellingPrice: number; unit?: { name: string; abbreviation?: string } },
  quantity: number,
  notes?: string
): string {
  const unitName = product.unit?.name || product.unit?.abbreviation || 'وحدة';
  const total = (product.sellingPrice * quantity).toFixed(2);

  let msg = `السلام عليكم ورحمة الله وبركاته،\nأرغب في طلب المنتج التالي من قطوف الطبيعة:\n\n`;
  msg += `📍 المنتج: ${product.name}\n`;
  msg += `📦 الكمية: ${quantity} (${unitName})\n`;
  msg += `💰 السعر: ${formatPrice(product.sellingPrice)} / ${unitName}\n`;
  msg += `💵 الإجمالي: ${formatPrice(Number(total))}\n`;

  if (notes && notes.trim()) {
    msg += `📝 ملاحظات: ${notes.trim()}\n`;
  }

  msg += `\nأتمنى التواصل معي لتأكيد الطلب وترتيب التوصيل. شكراً لكم!`;
  return msg;
}

/**
 * Formats a cart itemized order message for WhatsApp
 */
export function buildCartWhatsAppMessage(
  items: Array<{ name: string; price: number; quantity: number; unitName?: string }>,
  grandTotal: number
): string {
  let msg = `السلام عليكم ورحمة الله وبركاته،\nأرغب في طلب المنتجات التالية من قطوف الطبيعة:\n\n`;

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    const unit = item.unitName ? ` ${item.unitName}` : '';
    msg += `${index + 1}. ${item.name} — ${item.quantity}${unit} (الإجمالي: ${formatPrice(itemTotal)})\n`;
  });

  msg += `\n💳 إجمالي الطلب: ${formatPrice(grandTotal)}\n`;
  msg += `\nأتمنى التواصل معي لتأكيد الطلب. شكراً لكم!`;
  return msg;
}

export function buildWhatsAppContactLabel(target: WhatsAppTarget = 'store'): string {
  const contact = WHATSAPP_CONTACTS[target];
  return `${WHATSAPP_CONFIG.countryCode} ${contact.phone.slice(0, 3)} ${contact.phone.slice(3, 6)} ${contact.phone.slice(6)}`;
}
