export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';
export type Currency = 'INR' | 'USD';

export interface CardData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: Currency;
  transactionId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
  currency: Currency;
  timestamp: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: number;
  cardNumber: string;
  failureReason?: string;
  attempts: number;
}

export interface ValidationErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  amount?: string;
}
