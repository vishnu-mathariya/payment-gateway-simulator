import { CardType, CardData } from '@/types';

export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) {
    return 'visa';
  }
  if (/^5[1-5][0-9]{14}$/.test(cleaned)) {
    return 'mastercard';
  }
  if (/^3[47][0-9]{13}$/.test(cleaned)) {
    return 'amex';
  }
  return 'unknown';
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
}

export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
  return cleaned;
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length <= 4) {
    return cleaned;
  }
  const lastFour = cleaned.slice(-4);
  return '*'.repeat(cleaned.length - 4) + lastFour;
}

export function formatCardForDisplay(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
}
