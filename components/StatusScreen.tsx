'use client';

import { PaymentStatus } from '@/types';

interface StatusScreenProps {
  status: PaymentStatus;
  message?: string;
  failureReason?: string;
  currentAttempt?: number;
  maxAttempts?: number;
  amount?: number;
  currency?: string;
  onRetry?: () => void;
  onReset?: () => void;
  canRetry?: boolean;
}

export function StatusScreen({
  status,
  message,
  failureReason,
  currentAttempt,
  maxAttempts,
  amount,
  currency,
  onRetry,
  onReset,
  canRetry,
}: StatusScreenProps) {
  if (status === 'idle' || status === 'processing') {
    return null;
  }

  const isSuccess = status === 'success';
  const isFailed = status === 'failed' || status === 'timeout';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-md w-full">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {isSuccess && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground">Payment Successful!</h2>
              <div className="text-center">
                <p className="text-muted-foreground mb-3 sm:mb-4">Your payment has been processed</p>
                {amount && currency && (
                  <p className="text-3xl sm:text-4xl font-bold text-secondary">
                    {currency} {amount.toFixed(2)}
                  </p>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">{message}</p>
            </>
          )}

          {isFailed && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground">Payment Failed</h2>
              <div className="text-center">
                {status === 'timeout' && (
                  <>
                    <p className="text-muted-foreground mb-2">Request timed out</p>
                    <p className="text-xs sm:text-sm text-destructive font-medium">Please try again</p>
                  </>
                )}
                {status === 'failed' && failureReason && (
                  <p className="text-muted-foreground">Reason: {failureReason}</p>
                )}
              </div>
              {currentAttempt && maxAttempts && (
                <div className="w-full bg-muted rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-card-foreground font-medium text-center">
                    Attempt {currentAttempt} of {maxAttempts}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="w-full flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            {isFailed && canRetry && (
              <>
                <button
                  onClick={onRetry}
                  className="flex-1 px-4 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl sm:rounded-2xl hover:bg-primary/90 transition-all text-sm sm:text-base shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Retry
                </button>
                <button
                  onClick={onReset}
                  className="flex-1 px-4 py-3 sm:py-4 bg-muted text-card-foreground font-semibold rounded-xl sm:rounded-2xl hover:bg-muted/80 transition-all text-sm sm:text-base cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
            {(isSuccess || (isFailed && !canRetry)) && (
              <button
                onClick={onReset}
                className="w-full px-4 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl sm:rounded-2xl hover:bg-primary/90 transition-all text-sm sm:text-base shadow-lg hover:shadow-xl cursor-pointer"
              >
                {isSuccess ? 'Make Another Payment' : 'Close'}
              </button>
            )}
          </div>

          {isFailed && !canRetry && (
            <p className="text-xs sm:text-sm text-destructive text-center font-semibold bg-destructive/10 rounded-lg p-3 sm:p-4 w-full">
              Maximum retry attempts reached. Please contact support.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
