import { CardData, ValidationErrors } from '@/types';
import { detectCardType } from './cardUtils';

export function validateCardholderName(name: string): string | undefined {
  if (!name.trim()) {
    return 'Cardholder name is required';
  }
  if (name.trim().length < 3) {
    return 'Name must be at least 3 characters';
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return undefined;
}

export function validateCardNumber(cardNumber: string): string | undefined {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!cleaned) {
    return 'Card number is required';
  }
  if (!/^\d+$/.test(cleaned)) {
    return 'Card number must contain only digits';
  }
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Card number must be 13-19 digits';
  }
  if (!luhnCheck(cleaned)) {
    return 'Card number is invalid';
  }
  return undefined;
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateExpiryDate(expiryDate: string): string | undefined {
  if (!expiryDate) {
    return 'Expiry date is required';
  }
  const regex = /^(\d{2})\/(\d{2})$/;
  if (!regex.test(expiryDate)) {
    return 'Expiry date must be in MM/YY format';
  }

  const [, month, year] = expiryDate.match(regex)!;
  const monthNum = parseInt(month, 10);

  if (monthNum < 1 || monthNum > 12) {
    return 'Month must be between 01 and 12';
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = parseInt(year, 10);

  if (expiryYear < currentYear) {
    return 'Card has expired';
  }

  if (expiryYear === currentYear && monthNum < currentMonth) {
    return 'Card has expired';
  }

  return undefined;
}

export function validateCVV(cvv: string, cardType: string): string | undefined {
  const cleaned = cvv.replace(/\D/g, '');
  if (!cleaned) {
    return 'CVV is required';
  }
  const isAmex = cardType === 'amex';
  const validLength = isAmex ? 4 : 3;
  if (cleaned.length !== validLength) {
    return `CVV must be ${validLength} digits for ${isAmex ? 'Amex' : 'this'} cards`;
  }
  return undefined;
}

export function validateAmount(amount: string): string | undefined {
  if (!amount) {
    return 'Amount is required';
  }
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return 'Amount must be greater than 0';
  }
  if (num > 1000000) {
    return 'Amount must be less than 1,000,000';
  }
  return undefined;
}

export function validateCardData(data: CardData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateCardholderName(data.cardholderName);
  if (nameError) errors.cardholderName = nameError;

  const cardError = validateCardNumber(data.cardNumber);
  if (cardError) errors.cardNumber = cardError;

  const expiryError = validateExpiryDate(data.expiryDate);
  if (expiryError) errors.expiryDate = expiryError;

  const cardType = detectCardType(data.cardNumber);
  const cvvError = validateCVV(data.cvv, cardType);
  if (cvvError) errors.cvv = cvvError;

  return errors;
}



export function isFormValid(errors: ValidationErrors): boolean {
  return Object.values(errors).every((error) => !error);
}