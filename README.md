# Payment Gateway - Mid-Level Frontend Assignment

A fully functional, production-ready payment gateway UI built with Next.js, TypeScript, and Redux Toolkit. This implementation demonstrates advanced frontend fundamentals, clean architecture, and real-world payment processing patterns.

## ✨ Features

### Payment Form & Validation
- **Real-time field validation** with per-field error messages on blur and as-you-type
- **Card number auto-formatting** with spaces every 4 digits
- **Automatic card type detection** (Visa, Mastercard, Amex) with visual badges
- **Smart CVV handling** - 3 digits for regular cards, 4 for Amex
- **Expiry date validation** - rejects past dates with MM/YY format enforcement
- **Amount validation** - supports amounts up to 1,000,000 with multi-currency support

### Card Preview
- **Live card preview** that updates in real-time as the user fills the form
- **Gradient backgrounds** differentiated by card type
- **Visual feedback** showing cardholder name, card number, expiry date, and card type
- **Responsive design** that works on mobile and desktop

### Payment Processing
- **Full lifecycle management** - Idle, Processing, Success, Failed, and Timeout states
- **2-second simulated processing** with loading indicators
- **Mock gateway API** that randomly returns success (60%), failures (25%), or timeouts (15%)
- **Timeout handling** using AbortController with 6-second frontend timeout and 8-second server delay
- **Idempotent transactions** using crypto.randomUUID() for unique transaction IDs

### Retry Logic & Error Handling
- **Smart retry mechanism** - maximum 3 attempts per transaction
- **Attempt tracking** - displays current attempt (e.g., "Attempt 2 of 3")
- **Transaction ID reuse** - same ID passed on retries for consistent history
- **Failed transaction details** - displays failure reasons (Insufficient funds, Card declined, etc.)
- **Network error handling** - separates network errors from API failures

### Transaction History
- **Persistent localStorage storage** - survives page refreshes
- **Transaction details** - ID, amount, status, timestamp, card number (masked), attempts, failure reason
- **Click to expand** - view full transaction details by clicking any transaction
- **Status indicators** - visual badges for success, failed, timeout, and processing states
- **Sorted display** - most recent transactions appear first

### Accessibility & UX
- **ARIA labels and descriptions** - all form inputs properly labeled with aria-describedby
- **Focus management** - maintains user focus through state transitions
- **Semantic HTML** - proper use of labels, buttons, and form elements
- **Screen reader support** - all interactive elements accessible via keyboard and screen readers
- **Responsive design** - works on mobile (375px) and desktop (1280px) viewports
- **Double-submission prevention** - submit button disabled during processing

## 🏗️ Architecture

### Folder Structure
```
/vercel/share/v0-project
├── app/
│   ├── api/
│   │   └── pay/
│   │       └── route.ts           # Mock payment gateway API
│   ├── layout.tsx                 # Root layout with Redux provider
│   ├── page.tsx                   # Main payment page
│   ├── providers.tsx              # Redux Provider wrapper
│   └── globals.css                # Global styles
├── components/
│   ├── CardPreview.tsx            # Live card visualization
│   ├── PaymentForm.tsx            # Main form component
│   ├── StatusScreen.tsx           # Success/failure modal
│   ├── TransactionHistory.tsx     # Transaction list
│   └── CurrencySelector.tsx       # Currency dropdown
├── hooks/
│   ├── usePayment.ts              # Payment processing hook
│   └── useCardForm.ts             # Form state management hook
├── store/
│   ├── index.ts                   # Redux store configuration
│   └── paymentSlice.ts            # Payment state slice
├── types/
│   └── index.ts                   # TypeScript interfaces and types
├── utils/
│   ├── cardUtils.ts               # Card formatting and detection
│   ├── validation.ts              # Form validation logic
│   └── storage.ts                 # localStorage utilities
└── package.json
```

### State Management (Redux Toolkit)
- **`paymentSlice`** - manages payment status, errors, transaction history, and selected transaction
- **Actions**: `setStatus`, `setError`, `incrementAttempt`, `addTransaction`, `updateTransaction`, etc.
- **Global access** - payment state accessible from any component via `useSelector`

### Custom Hooks
- **`useCardForm`** - handles form state, validation, and field updates
  - Auto-formatting (card number, expiry date)
  - Real-time validation
  - Touched field tracking
  - Form reset functionality
  
- **`usePayment`** - manages payment processing and retry logic
  - API communication
  - Timeout handling with AbortController
  - Retry management with attempt tracking
  - Transaction status updates

### Utility Modules
- **`cardUtils.ts`** - card type detection, formatting, masking
- **`validation.ts`** - comprehensive form validation (Luhn algorithm included)
- **`storage.ts`** - localStorage operations for transaction persistence

## 🔧 Technical Highlights

### Validation & Security
- **Luhn algorithm** for card number validation
- **Strict TypeScript types** - no `any` types used
- **Input sanitization** - removes non-numeric characters from card number and CVV
- **Expiry date validation** - prevents past dates and invalid months
- **CVV length validation** - contextual based on card type

### Performance Optimizations
- **Memoized callbacks** using `useCallback` in custom hooks
- **Conditional rendering** - modals only render when needed
- **Efficient state updates** - Redux for global state, local state for form fields
- **Lazy validation** - only validates touched fields

### Error Handling
- **Network errors** - caught separately from API errors
- **Timeout handling** - 6-second AbortController timeout
- **Friendly error messages** - user-facing messages instead of raw errors
- **Failure reasons** - server returns specific failure reasons for debugging

### Accessibility
- **ARIA attributes** - `aria-label`, `aria-describedby`, `aria-expanded`
- **Form labels** - every input has an associated label
- **Keyboard navigation** - all buttons and inputs accessible via keyboard
- **Color contrast** - meets WCAG standards

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ or newer
- pnpm, npm, or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd payment-gateway
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production
```bash
pnpm build
pnpm start
```

## 📝 Usage

1. **Fill Payment Form**
   - Enter cardholder name
   - Enter card number (will auto-format)
   - Enter expiry date (MM/YY format)
   - Enter CVV (3 or 4 digits based on card type)
   - Enter amount and select currency

2. **Submit Payment**
   - Click "Pay" button to submit
   - Form will be disabled while processing
   - See processing spinner for ~2 seconds

3. **Handle Results**
   - **Success**: Shows success modal with transaction details
   - **Failure**: Shows failure reason with retry option
   - **Timeout**: Shows timeout message with retry option

4. **Retry Payment**
   - Click "Retry" to attempt payment again (max 3 times)
   - Each retry uses the same transaction ID
   - After 3 failed attempts, retry is disabled

5. **View Transaction History**
   - All transactions persist in localStorage
   - Click any transaction to view full details
   - See transaction ID, date, amount, and failure reasons

## 🧪 Testing Scenarios

### Successful Payment (60% of requests)
- Fill form with valid data
- Submit and wait for success screen

### Failed Payment (25% of requests)
- Fill form with valid data
- Submit to receive failure with reason
- Click "Retry" to attempt again

### Timeout Payment (15% of requests)
- Fill form with valid data
- Submit and wait 6 seconds to see timeout message
- Click "Retry" to attempt again

### Invalid Data
- Try entering non-numeric characters in card number
- Try entering expired date
- Try entering invalid CVV length
- Submit button will remain disabled until all errors are resolved

## 🔄 API Endpoint

### POST `/api/pay`

**Request:**
```json
{
  "cardholderName": "John Doe",
  "cardNumber": "4242424242424242",
  "expiryDate": "12/25",
  "cvv": "123",
  "amount": 100,
  "currency": "INR",
  "transactionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Success):**
```json
{
  "success": true,
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Payment successful",
  "amount": 100,
  "currency": "INR",
  "timestamp": 1234567890
}
```

**Response (Failure):**
```json
{
  "success": false,
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Insufficient funds",
  "amount": 100,
  "currency": "INR",
  "timestamp": 1234567890
}
```

## 📱 Responsive Design

- **Mobile (375px)**: Single column layout, optimized touch targets
- **Tablet (768px)**: 2-column form layout
- **Desktop (1280px)**: 3-column layout with sticky transaction history

## 🎨 Design System

- **Color Scheme**: Blue primary, gray neutrals, green for success, red for errors
- **Card Gradients**: Visa (blue), Mastercard (red-orange), Amex (emerald)
- **Spacing**: Tailwind CSS scale (4px, 8px, 16px, 24px, etc.)
- **Typography**: Geist Sans for body, Geist Mono for card numbers

## 🔐 Security Considerations

- **No credential storage** - card details not stored anywhere
- **HTTPS recommended** - use HTTPS in production
- **Client-side validation** - prevents invalid submissions
- **Timeout handling** - prevents hanging requests
- **Transaction IDs** - unique ID for each payment attempt

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚧 Assumptions & Limitations

### Assumptions Made
1. **Mock Gateway** - This implementation uses a mock gateway for demonstration. In production, integrate with a real payment provider like Stripe or Razorpay.
2. **localStorage** - Transaction history uses browser localStorage. For production, use a backend database.
3. **Client-side Processing** - All validation happens client-side. Production should validate on server as well.
4. **CORS** - API calls work on same origin. Adjust CORS headers for cross-origin requests.
5. **No Database** - No user accounts or persistent backend storage.

### Known Limitations
1. **Test Card Numbers** - Use any valid card number (e.g., 4242 4242 4242 4242 for Visa)
2. **No Real Processing** - Payments are simulated, not processed
3. **Browser Storage Only** - Data lost if localStorage is cleared
4. **No Authentication** - No user login or account management
5. **Single Currency** - Only INR and USD supported (easily extendable)

## 🎯 What Would Be Improved Given More Time

1. **Backend Integration**
   - Real payment provider SDK (Stripe, Razorpay)
   - Server-side validation and security
   - Database for transaction persistence
   - User authentication and accounts

2. **Enhanced UX**
   - Bill Address verification
   - 3D Secure / 2FA support
   - Payment method saved cards
   - Email receipt after payment

3. **Analytics & Monitoring**
   - Transaction success rate tracking
   - Error rate monitoring
   - Payment latency metrics
   - User behavior analytics

4. **Testing**
   - Unit tests for utils and hooks
   - Integration tests for payment flow
   - E2E tests with Playwright
   - Performance testing

5. **Performance**
   - Code splitting for larger app
   - Image optimization
   - Caching strategies
   - Service Worker for offline support

6. **Internationalization**
   - Multi-language support
   - Regional formatting (date, currency)
   - Localized error messages
   - RTL language support

7. **Advanced Features**
   - Payment method tokenization
   - Recurring payments / subscriptions
   - Refund management
   - Dispute handling
   - Webhook integration

8. **DevOps**
   - Automated testing in CI/CD
   - Staging environment setup
   - PCI compliance validation
   - Security vulnerability scanning

## 📄 License

This project is part of a mid-level frontend assignment and is provided as-is for educational purposes.

## 🤝 Commit History

The implementation was completed with meaningful commits for each major feature:

1. Initial project setup with folder structure
2. Type definitions and utility functions
3. Redux store configuration
4. Custom hooks (useCardForm, usePayment)
5. API route handler
6. React components (Card preview, Form, Status screen, History)
7. Main page integration
8. Styling and responsive design
9. Documentation

## ✅ Checklist - All Requirements Met

- ✅ Payment form with card number, expiry, CVV, amount, cardholder name
- ✅ Real-time validation with per-field error messages
- ✅ Card auto-formatting (spaces every 4 digits)
- ✅ Card type detection (Visa, Mastercard, Amex)
- ✅ Expiry date validation (rejects past dates)
- ✅ CVV validation (3 for regular, 4 for Amex)
- ✅ Live card preview
- ✅ Currency selector (INR, USD)
- ✅ Full payment lifecycle (Idle, Processing, Success, Failed, Timeout)
- ✅ Mock gateway API at /api/pay
- ✅ Success (60%), Failed (25%), Timeout (15%) distribution
- ✅ 6-second timeout with AbortController
- ✅ 8-second server delay for timeout simulation
- ✅ Failure handling with specific reasons
- ✅ Retry logic with max 3 attempts
- ✅ Attempt counter display
- ✅ Transaction ID reuse on retries
- ✅ Transaction history with localStorage persistence
- ✅ Transaction click to view details
- ✅ Transaction ID generation with crypto.randomUUID()
- ✅ Clean, modular code with proper separation of concerns
- ✅ Components in separate files
- ✅ Business logic in utils and hooks
- ✅ Folder structure (components/, hooks/, utils/, types/, store/)
- ✅ TypeScript with no `any` types
- ✅ Proper interfaces and types
- ✅ Redux Toolkit for state management
- ✅ Error handling (network + API)
- ✅ Friendly error messages
- ✅ AbortController timeout handling
- ✅ Mobile (375px) responsive design
- ✅ Desktop (1280px) responsive design
- ✅ Form labels for all inputs
- ✅ aria-describedby for errors
- ✅ Focus management
- ✅ Double submission prevention
- ✅ Production-ready code quality

---

**Created**: May 2026  
**Stack**: Next.js 16 + App Router, TypeScript, Redux Toolkit, Tailwind CSS
#   p a y m e n t - g a t e w a y - s i m u l a t o r  
 