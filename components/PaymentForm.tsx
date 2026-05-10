'use client';

import { useState } from 'react';
import { useCardForm } from '@/hooks/useCardForm';
import { usePayment } from '@/hooks/usePayment';
import { detectCardType } from '@/utils/cardUtils';
import { PaymentPayload } from '@/types';
import { CardPreview } from './CardPreview';
import { CurrencySelector } from './CurrencySelector';

interface PaymentFormProps {
  onPaymentSubmit: (transactionId: string) => void;
}

export function PaymentForm({ onPaymentSubmit }: PaymentFormProps) {
  const {
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
  } = useCardForm();

  const { status, error, initializePayment, processPayment, resetPayment } = usePayment();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || isSubmitting || status === 'processing') {
      return;
    }

    setIsSubmitting(true);

    const transactionId = crypto.randomUUID();
    initializePayment(transactionId);

    const payload: PaymentPayload = {
      cardholderName: cardData.cardholderName,
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiryDate,
      cvv: cardData.cvv,
      amount: parseFloat(amount),
      currency,
      transactionId,
    };

    await processPayment(payload);
    onPaymentSubmit(transactionId);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    resetForm();
    resetPayment();
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    return validationErrors[field as keyof typeof validationErrors];
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-8">
      {/* Card Preview */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-card-foreground mb-3 sm:mb-4 uppercase tracking-wide">
          Card Preview
        </label>
        <CardPreview cardData={cardData} />
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
          Cardholder Name
        </label>
        <input
          id="cardholderName"
          type="text"
          placeholder="John Doe"
          value={cardData.cardholderName}
          onChange={(e) => updateCardholderName(e.target.value)}
          onBlur={() => setTouched('cardholderName', true)}
          aria-describedby={getFieldError('cardholderName') ? 'error-cardholderName' : undefined}
          className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base transition-all ${
            getFieldError('cardholderName') ? 'border-destructive bg-red-50' : 'border-input bg-muted hover:border-primary/50'
          }`}
        />
        {getFieldError('cardholderName') && (
          <p id="error-cardholderName" className="mt-2 text-xs sm:text-sm text-destructive font-medium">
            {getFieldError('cardholderName')}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
          Card Number
        </label>
        <input
          id="cardNumber"
          type="text"
          placeholder="4242 4242 4242 4242"
          value={cardData.cardNumber}
          onChange={(e) => updateCardNumber(e.target.value)}
          onBlur={() => setTouched('cardNumber', true)}
          aria-describedby={getFieldError('cardNumber') ? 'error-cardNumber' : undefined}
          maxLength={23}
          className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm sm:text-base transition-all ${
            getFieldError('cardNumber') ? 'border-destructive bg-red-50' : 'border-input bg-muted hover:border-primary/50'
          }`}
        />
        {getFieldError('cardNumber') && (
          <p id="error-cardNumber" className="mt-2 text-xs sm:text-sm text-destructive font-medium">
            {getFieldError('cardNumber')}
          </p>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={cardData.expiryDate}
            onChange={(e) => updateExpiryDate(e.target.value)}
            onBlur={() => setTouched('expiryDate', true)}
            aria-describedby={
              getFieldError('expiryDate') ? 'error-expiryDate' : undefined
            }
            maxLength={5}
            className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm sm:text-base transition-all ${
              getFieldError('expiryDate') ? 'border-destructive bg-red-50' : 'border-input bg-muted hover:border-primary/50'
            }`}
          />
          {getFieldError('expiryDate') && (
            <p id="error-expiryDate" className="mt-2 text-xs sm:text-sm text-destructive font-medium">
              {getFieldError('expiryDate')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
            CVV {cardType === 'amex' ? '(4)' : '(3)'}
          </label>
          <input
            id="cvv"
            type="password"
            placeholder={cardType === 'amex' ? '1234' : '123'}
            value={cardData.cvv}
            onChange={(e) => updateCVV(e.target.value)}
            onBlur={() => setTouched('cvv', true)}
            aria-describedby={getFieldError('cvv') ? 'error-cvv' : undefined}
            maxLength={cardType === 'amex' ? 4 : 3}
            className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm sm:text-base transition-all ${
              getFieldError('cvv') ? 'border-destructive bg-red-50' : 'border-input bg-muted hover:border-primary/50'
            }`}
          />
          {getFieldError('cvv') && (
            <p id="error-cvv" className="mt-2 text-xs sm:text-sm text-destructive font-medium">
              {getFieldError('cvv')}
            </p>
          )}
        </div>
      </div>

      {/* Amount and Currency */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="md:col-span-2">
          <label htmlFor="amount" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            placeholder="100"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            onBlur={() => setTouched('amount', true)}
            aria-describedby={amountError ? 'error-amount' : undefined}
            step="0.01"
            min="0"
            className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base transition-all ${
              amountError ? 'border-destructive bg-red-50' : 'border-input bg-muted hover:border-primary/50'
            }`}
          />
          {amountError && (
            <p id="error-amount" className="mt-2 text-xs sm:text-sm text-destructive font-medium">
              {amountError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="block text-xs sm:text-sm font-semibold text-card-foreground mb-2 sm:mb-3">
            Currency
          </label>
          <CurrencySelector value={currency} onChange={updateCurrency} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting || status === 'processing'}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl sm:rounded-2xl hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all text-sm sm:text-base shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer"
        aria-label={status === 'processing' ? 'Processing payment...' : 'Pay now'}
      >
        {status === 'processing' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ${currency} ${amount || '0'}`
        )}
      </button>

      {/* Reset Button */}
      {isValid && status === 'idle' && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-muted text-card-foreground font-semibold rounded-xl sm:rounded-2xl hover:bg-muted/80 transition-all text-sm sm:text-base cursor-pointer"
        >
          Clear Form
        </button>
      )}
    </form>
  );
}
