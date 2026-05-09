'use client';

import { Currency } from '@/types';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <select
      id="currency"
      value={value}
      onChange={(e) => onChange(e.target.value as Currency)}
      className="w-full px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-input rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-muted hover:border-primary/50 text-sm sm:text-base font-medium text-card-foreground transition-all cursor-pointer"
      aria-label="Select currency"
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
    </select>
  );
}
