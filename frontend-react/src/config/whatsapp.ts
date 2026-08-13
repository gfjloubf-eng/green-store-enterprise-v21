/* ============================================================
    WhatsApp Configuration
    Centralized customer contact configuration for the marketplace.
    ============================================================ */

export const WHATSAPP_CONFIG = {
  managerNumber: '712275038',
  countryCode: '+967',
} as const;

export const WHATSAPP_NUMBER = `${WHATSAPP_CONFIG.countryCode}${WHATSAPP_CONFIG.managerNumber}`;

export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.managerNumber}?text=${encodedMessage}`;
}

export function buildWhatsAppContactLabel(): string {
  return `${WHATSAPP_CONFIG.countryCode} ${WHATSAPP_CONFIG.managerNumber.slice(0, 3)} ${WHATSAPP_CONFIG.managerNumber.slice(3, 6)} ${WHATSAPP_CONFIG.managerNumber.slice(6)}`;
}
