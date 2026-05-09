'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setTransactions, setSelectedTransaction } from '@/store/paymentSlice';
import { usePayment } from '@/hooks/usePayment';
import { PaymentForm } from '@/components/PaymentForm';
import { StatusScreen } from '@/components/StatusScreen';
import { TransactionHistory } from '@/components/TransactionHistory';
import { getTransactionHistory, getTransaction } from '@/utils/storage';
import { PaymentPayload } from '@/types';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, currentAttempt, maxAttempts, currentTransactionId, error, successMessage } =
    useSelector((state: RootState) => state.payment);
  const transactions = useSelector((state: RootState) => state.payment.transactions);
  const selectedTransaction = useSelector((state: RootState) => state.payment.selectedTransaction);

  const {
    retryPayment,
    resetPayment,
    updateTransactionStatus,
    canRetry,
  } = usePayment();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedTransactions = getTransactionHistory();
    dispatch(setTransactions(storedTransactions));
    setIsInitialized(true);
  }, [dispatch]);

  const handleRetry = async () => {
    if (!currentTransactionId || !canRetry || !selectedTransaction) {
      return;
    }

    const payload: PaymentPayload = {
      cardholderName: selectedTransaction.id,
      cardNumber: selectedTransaction.cardNumber,
      expiryDate: 'MM/YY',
      cvv: '000',
      amount: selectedTransaction.amount,
      currency: selectedTransaction.currency,
      transactionId: currentTransactionId,
    };

    const result = await retryPayment(payload);

    if (result.success) {
      updateTransactionStatus(currentTransactionId, 'success');
    } else if (result.isTimeout) {
      updateTransactionStatus(currentTransactionId, 'timeout');
    } else {
      updateTransactionStatus(currentTransactionId, 'failed', error);
    }
  };

  const handleReset = () => {
    dispatch(setSelectedTransaction(null));
    resetPayment();
  };

  const handleSelectTransaction = (transactionId: string) => {
    const transaction = getTransaction(transactionId);
    if (transaction) {
      dispatch(setSelectedTransaction(transaction));
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 sm:mb-3">
            Secure Payment
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Fast, reliable, and secure payment processing
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Payment Form Section */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-6 sm:mb-8">
                Payment Details
              </h2>
              <PaymentForm onPaymentSubmit={handleSelectTransaction} />
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8 md:sticky md:top-6">
              <TransactionHistory
                transactions={transactions}
                onSelectTransaction={(transaction) => {
                  dispatch(setSelectedTransaction(transaction));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Screen Modal */}
      {(status === 'success' || status === 'failed' || status === 'timeout') && (
        <StatusScreen
          status={status}
          message={successMessage || error}
          failureReason={selectedTransaction?.failureReason}
          currentAttempt={currentAttempt}
          maxAttempts={maxAttempts}
          amount={selectedTransaction?.amount}
          currency={selectedTransaction?.currency}
          onRetry={handleRetry}
          onReset={handleReset}
          canRetry={canRetry}
        />
      )}
    </main>
  );
}
