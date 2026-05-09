import { useState, useCallback, useEffect } from 'react';
import { CardData, ValidationErrors, CardType } from '@/types';
import { formatCardNumber, formatExpiryDate, detectCardType } from '@/utils/cardUtils';
import {
  validateCardholderName,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateAmount,
  isFormValid,
} from '@/utils/validation';

interface UseCardFormReturn {
  cardData: CardData;
  amount: string;
  currency: 'INR' | 'USD';
  validationErrors: ValidationErrors;
  amountError: string | undefined;
  cardType: CardType;
  touched: Record<string, boolean>;
  isValid: boolean;
  updateCardholderName: (value: string) => void;
  updateCardNumber: (value: string) => void;
  updateExpiryDate: (value: string) => void;
  updateCVV: (value: string) => void;
  updateAmount: (value: string) => void;
  updateCurrency: (currency: 'INR' | 'USD') => void;
  setTouched: (field: string, isTouched: boolean) => void;
  resetForm: () => void;
}

const initialCardData: CardData = {
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
};

export function useCardForm(): UseCardFormReturn {
  const [cardData, setCardData] = useState<CardData>(initialCardData);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [amountError, setAmountError] = useState<string | undefined>();
  const [touched, setTouchedFields] = useState<Record<string, boolean>>({});

  const cardType = detectCardType(cardData.cardNumber);

  const validateField = useCallback(
    (field: string, value: string): void => {
      let error: string | undefined;

      switch (field) {
        case 'cardholderName':
          error = validateCardholderName(value);
          setValidationErrors((prev) => ({ ...prev, cardholderName: error }));
          break;
        case 'cardNumber':
          error = validateCardNumber(value);
          setValidationErrors((prev) => ({ ...prev, cardNumber: error }));
          break;
        case 'expiryDate':
          error = validateExpiryDate(value);
          setValidationErrors((prev) => ({ ...prev, expiryDate: error }));
          break;
        case 'cvv':
          error = validateCVV(value, detectCardType(cardData.cardNumber));
          setValidationErrors((prev) => ({ ...prev, cvv: error }));
          break;
        case 'amount':
          error = validateAmount(value);
          setAmountError(error);
          break;
      }
    },
    [cardData.cardNumber]
  );

  const updateCardholderName = useCallback(
    (value: string) => {
      setCardData((prev) => ({ ...prev, cardholderName: value }));
      if (touched.cardholderName) {
        validateField('cardholderName', value);
      }
    },
    [touched, validateField]
  );

  const updateCardNumber = useCallback(
    (value: string) => {
      const formatted = formatCardNumber(value);
      setCardData((prev) => ({ ...prev, cardNumber: formatted }));
      if (touched.cardNumber) {
        validateField('cardNumber', formatted);
      }
    },
    [touched, validateField]
  );

  const updateExpiryDate = useCallback(
    (value: string) => {
      const formatted = formatExpiryDate(value);
      setCardData((prev) => ({ ...prev, expiryDate: formatted }));
      if (touched.expiryDate) {
        validateField('expiryDate', formatted);
      }
    },
    [touched, validateField]
  );

  const updateCVV = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      const maxLength = cardType === 'amex' ? 4 : 3;
      const truncated = cleaned.slice(0, maxLength);
      setCardData((prev) => ({ ...prev, cvv: truncated }));
      if (touched.cvv) {
        validateField('cvv', truncated);
      }
    },
    [cardType, touched, validateField]
  );

  const updateAmount = useCallback(
    (value: string) => {
      setAmount(value);
      if (touched.amount) {
        validateField('amount', value);
      }
    },
    [touched, validateField]
  );

  const updateCurrency = useCallback((newCurrency: 'INR' | 'USD') => {
    setCurrency(newCurrency);
  }, []);

  const setTouched = useCallback((field: string, isTouched: boolean) => {
    setTouchedFields((prev) => ({ ...prev, [field]: isTouched }));

    if (isTouched) {
      if (field === 'cardholderName') validateField('cardholderName', cardData.cardholderName);
      if (field === 'cardNumber') validateField('cardNumber', cardData.cardNumber);
      if (field === 'expiryDate') validateField('expiryDate', cardData.expiryDate);
      if (field === 'cvv') validateField('cvv', cardData.cvv);
      if (field === 'amount') validateField('amount', amount);
    }
  }, [cardData, amount, validateField]);

  const resetForm = useCallback(() => {
    setCardData(initialCardData);
    setAmount('');
    setCurrency('INR');
    setValidationErrors({});
    setAmountError(undefined);
    setTouchedFields({});
  }, []);

  const isValid = isFormValid(validationErrors) && !amountError && amount !== '';

  return {
    cardData,
    amount,
    currency,
    validationErrors,
    amountError,
    cardType,
    touched,
    isValid,
    updateCardholderName,
    updateCardNumber,
    updateExpiryDate,
    updateCVV,
    updateAmount,
    updateCurrency,
    setTouched,
    resetForm,
  };
}
