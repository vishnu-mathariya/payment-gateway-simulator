import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  setStatus,
  setError,
  setSuccessMessage,
  incrementAttempt,
  setCurrentTransactionId,
  resetPaymentState,
  addTransaction,
  updateTransaction,
} from '@/store/paymentSlice';
import { PaymentPayload, PaymentStatus, Transaction } from '@/types';
import { saveTransaction, updateTransaction as updateStoredTransaction } from '@/utils/storage';

const TIMEOUT_DURATION = 6000;

export function usePayment() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, successMessage, currentAttempt, maxAttempts, currentTransactionId } =
    useSelector((state: RootState) => state.payment);

  const processPayment = useCallback(
    async (payload: PaymentPayload) => {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), TIMEOUT_DURATION);

      try {
        dispatch(setStatus('processing'));
        dispatch(setError(null));

        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Payment failed');
        }

        const result = await response.json();

        const transaction: Transaction = {
          id: payload.transactionId,
          amount: payload.amount,
          currency: payload.currency,
          status: 'success',
          timestamp: Date.now(),
          cardNumber: payload.cardNumber,
          attempts: currentAttempt,
        };

        dispatch(setStatus('success'));
        dispatch(setSuccessMessage(`Payment of ${payload.currency} ${payload.amount} successful!`));
        dispatch(addTransaction(transaction));
        saveTransaction(transaction);

        return { success: true };
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === 'AbortError') {
          dispatch(setStatus('timeout'));
          dispatch(setError('Payment request timed out. Please try again.'));
          return { success: false, isTimeout: true };
        }

        const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
        dispatch(setError(errorMessage));
        dispatch(setStatus('failed'));

        return { success: false, isTimeout: false };
      }
    },
    [dispatch, currentAttempt]
  );

  const retryPayment = useCallback(
    async (payload: PaymentPayload) => {
      if (currentAttempt >= maxAttempts) {
        dispatch(setError('Maximum retry attempts reached'));
        return { success: false };
      }

      dispatch(incrementAttempt());
      return processPayment(payload);
    },
    [dispatch, currentAttempt, maxAttempts, processPayment]
  );

  const initializePayment = useCallback(
    (transactionId: string) => {
      dispatch(setCurrentTransactionId(transactionId));
    },
    [dispatch]
  );

  const resetPayment = useCallback(() => {
    dispatch(resetPaymentState());
  }, [dispatch]);

  const updateTransactionStatus = useCallback(
    (transactionId: string, transactionStatus: PaymentStatus, failureReason?: string) => {
      const updates = failureReason
        ? { status: transactionStatus, failureReason }
        : { status: transactionStatus };

      dispatch(updateTransaction({ id: transactionId, updates }));
      updateStoredTransaction(transactionId, updates);
    },
    [dispatch]
  );

  return {
    status,
    error,
    successMessage,
    currentAttempt,
    maxAttempts,
    currentTransactionId,
    processPayment,
    retryPayment,
    initializePayment,
    resetPayment,
    updateTransactionStatus,
    canRetry: currentAttempt < maxAttempts,
  };
}
