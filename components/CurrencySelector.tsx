
'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { Currency } from '@/types';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelector({
  value,
  onChange,
}: CurrencySelectorProps) {
  return (
    <Select.Root
      value={value}
      onValueChange={(value) => onChange(value as Currency)}
    >
      <Select.Trigger
        className="
          w-full
          flex
          items-center
          justify-between
          px-4
          sm:px-5
          py-2.5
          sm:py-3
          border-2
          border-input
          rounded-xl
          sm:rounded-2xl
          bg-muted
          text-sm
          sm:text-base
          font-medium
          focus:outline-none
          focus:ring-2
          focus:ring-primary
        "
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50
            overflow-hidden
            rounded-xl
            border
            bg-white
            shadow-lg
            w-[var(--radix-select-trigger-width)]
          "
          position="popper"
        >
          <Select.Viewport className="p-1">
            <Select.Item
              value="INR"
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <Select.ItemText>INR</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="USD"
              className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <Select.ItemText>USD</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}