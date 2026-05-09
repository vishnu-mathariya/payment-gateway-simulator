import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentStatus, Transaction, Currency } from '@/types';

interface PaymentState {
  status: PaymentStatus;
  currentTransactionId: string | null;
  error: string | null;
  successMessage: string | null;
  currentAttempt: number;
  maxAttempts: number;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
}

const initialState: PaymentState = {
  status: 'idle',
  currentTransactionId: null,
  error: null,
  successMessage: null,
  currentAttempt: 0,
  maxAttempts: 3,
  transactions: [],
  selectedTransaction: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload;
    },
    setCurrentTransactionId: (state, action: PayloadAction<string>) => {
      state.currentTransactionId = action.payload;
      state.currentAttempt = 1;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    incrementAttempt: (state) => {
      state.currentAttempt += 1;
    },
    resetPaymentState: (state) => {
      state.status = 'idle';
      state.currentTransactionId = null;
      state.error = null;
      state.successMessage = null;
      state.currentAttempt = 0;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload.updates,
        };
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
  },
});

export const {
  setStatus,
  setCurrentTransactionId,
  setError,
  setSuccessMessage,
  incrementAttempt,
  resetPaymentState,
  addTransaction,
  updateTransaction,
  setTransactions,
  setSelectedTransaction,
} = paymentSlice.actions;

export default paymentSlice.reducer;
