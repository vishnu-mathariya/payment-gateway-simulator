'use client';

import { CardData, CardType } from '@/types';
import { detectCardType, maskCardNumber, formatCardForDisplay } from '@/utils/cardUtils';

interface CardPreviewProps {
  cardData: CardData;
}

export function CardPreview({ cardData }: CardPreviewProps) {
  const cardType = detectCardType(cardData.cardNumber);
  const maskedNumber = maskCardNumber(cardData.cardNumber);
  const displayNumber = formatCardForDisplay(cardData.cardNumber) || '•••• •••• •••• ••••';

  const getCardColor = (type: CardType): string => {
    switch (type) {
      case 'visa':
        return 'from-blue-500 via-blue-600 to-cyan-600';
      case 'mastercard':
        return 'from-orange-500 via-red-500 to-pink-600';
      case 'amex':
        return 'from-green-500 via-emerald-500 to-teal-600';
      default:
        return 'from-slate-600 via-slate-700 to-slate-800';
    }
  };

  const getCardBrand = (type: CardType): string => {
    switch (type) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MASTERCARD';
      case 'amex':
        return 'AMEX';
      default:
        return 'CARD';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`bg-gradient-to-br ${getCardColor(
          cardType
        )} rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-2xl hover:shadow-2xl/50 transform transition-all duration-300 aspect-video flex flex-col justify-between`}
        role="img"
        aria-label={`Payment card preview - ${getCardBrand(cardType)}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs sm:text-sm font-semibold opacity-75 mb-1 sm:mb-2 tracking-wide">CARD NUMBER</div>
            <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono font-bold tracking-wider">
              {displayNumber}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-semibold opacity-75 mb-1 tracking-wide">TYPE</div>
            <div className="text-xs sm:text-sm md:text-base font-bold">{getCardBrand(cardType)}</div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs sm:text-sm font-semibold opacity-75 mb-1 tracking-wide">CARDHOLDER</div>
            <div className="text-xs sm:text-sm md:text-base font-semibold tracking-wide uppercase">
              {cardData.cardholderName || 'YOUR NAME'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-semibold opacity-75 mb-1 tracking-wide">EXPIRES</div>
            <div className="text-xs sm:text-sm md:text-base font-mono font-bold">
              {cardData.expiryDate || 'MM/YY'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
