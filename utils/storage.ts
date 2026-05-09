import { Transaction } from '@/types';

const TRANSACTION_KEY = 'payment_transactions';

export function getTransactionHistory(): Transaction[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = localStorage.getItem(TRANSACTION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.error('Error reading transaction history from localStorage');
    return [];
  }
}

export function saveTransaction(transaction: Transaction): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const history = getTransactionHistory();
    history.push(transaction);
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(history));
  } catch {
    console.error('Error saving transaction to localStorage');
  }
}

export function updateTransaction(transactionId: string, updates: Partial<Transaction>): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const history = getTransactionHistory();
    const index = history.findIndex((t) => t.id === transactionId);
    if (index !== -1) {
      history[index] = { ...history[index], ...updates };
      localStorage.setItem(TRANSACTION_KEY, JSON.stringify(history));
    }
  } catch {
    console.error('Error updating transaction in localStorage');
  }
}

export function getTransaction(transactionId: string): Transaction | null {
  const history = getTransactionHistory();
  return history.find((t) => t.id === transactionId) || null;
}

export function clearTransactionHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(TRANSACTION_KEY);
  } catch {
    console.error('Error clearing transaction history');
  }
}
