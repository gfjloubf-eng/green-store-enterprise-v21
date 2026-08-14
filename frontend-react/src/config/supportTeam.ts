/* ============================================================
   Support Team Configuration
   Centralized source of truth for support team members & contacts.
   ============================================================ */

export interface SupportMember {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  countryCode: string | null;
  whatsappNumber: string | null;
  availableChannels: ('call' | 'whatsapp' | 'ticket')[];
}

export const PRIMARY_COUNTRY_CODE = '+967';

export const SUPPORT_TEAM: SupportMember[] = [
  {
    id: 'ammar',
    name: 'عمار عادل المصوعي',
    role: 'الدعم التقني والتطوير ومتابعة النظام',
    phone: '712275038',
    countryCode: PRIMARY_COUNTRY_CODE,
    whatsappNumber: '967712275038',
    availableChannels: ['call', 'whatsapp', 'ticket'],
  },
  {
    id: 'saqr',
    name: 'صقر أنور',
    role: 'الدعم والتواصل ومتابعة العملاء والطلبات',
    phone: '777803161',
    countryCode: PRIMARY_COUNTRY_CODE,
    whatsappNumber: '967777803161',
    availableChannels: ['call', 'whatsapp', 'ticket'],
  },
];

/**
 * Builds a WhatsApp URL with exact order context message:
 * "السلام عليكم، لدي استفسار بخصوص الطلب #ORDER_NUMBER."
 */
export function buildWhatsAppOrderUrl(orderNumber: string, targetPhone?: string | null): string {
  const phone = targetPhone || SUPPORT_TEAM[0].whatsappNumber || '967712275038';
  const message = `السلام عليكم، لدي استفسار بخصوص الطلب #${orderNumber}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a WhatsApp URL for general inquiries
 */
export function buildWhatsAppGeneralUrl(targetPhone?: string | null, customMsg?: string): string {
  const phone = targetPhone || SUPPORT_TEAM[0].whatsappNumber || '967712275038';
  const message = customMsg || 'السلام عليكم، لدي استفسار بخصوص خدمات قطوف الطبيعة.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct call tel link
 */
export function buildTelUrl(phone?: string | null): string | null {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, '');
  return `tel:${cleanPhone}`;
}
