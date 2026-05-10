'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { maskCardNumber } from '@/utils/cardUtils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

export function TransactionHistory({ transactions, onSelectTransaction }: TransactionHistoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="bg-muted rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
        <p className="text-muted-foreground mb-2 font-medium text-sm sm:text-base">No transactions yet</p>
        <p className="text-xs sm:text-sm text-muted-foreground">Your payment history will appear here</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-4 sm:mb-6">History</h3>

      {sortedTransactions.map((transaction) => (
        <div key={transaction.id}>
          <button
            onClick={() => {
              setSelectedId(transaction.id);
              setExpandedId(expandedId === transaction.id ? null : transaction.id);
              onSelectTransaction(transaction);
            }}
            className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
              selectedId === transaction.id
                ? 'bg-primary/10 border-primary'
                : 'bg-muted border-border hover:border-primary/50'
            }`}
            aria-expanded={expandedId === transaction.id}
          >
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-card-foreground text-xs sm:text-sm flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono truncate">{transaction.id.slice(0, 8)}...</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                  {maskCardNumber(transaction.cardNumber)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-card-foreground text-xs sm:text-sm">
                  {transaction.currency} {transaction.amount.toFixed(2)}
                </div>
                <div
                  className={`text-xs sm:text-sm font-semibold mt-1 px-2 py-1 rounded-lg inline-block ${getStatusColor(transaction.status)}`}
                >
                  {getStatusLabel(transaction.status)}
                </div>
              </div>
            </div>

            {expandedId === transaction.id && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border text-xs sm:text-sm text-card-foreground space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs truncate ml-2">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Date:</span>
                  <span className="text-xs">{new Date(transaction.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Attempts:</span>
                  <span>{transaction.attempts}</span>
                </div>
                {transaction.failureReason && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="font-semibold text-destructive">Reason:</span>
                    <span className="text-destructive text-xs sm:text-sm">{transaction.failureReason}</span>
                  </div>
                )}
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'failed':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'timeout':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'processing':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'success':
      return '✓ Successful';
    case 'failed':
      return '✗ Failed';
    case 'timeout':
      return '⏱ Timeout';
    case 'processing':
      return '⟳ Processing';
    default:
      return status;
  }
}
