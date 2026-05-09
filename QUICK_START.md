# Quick Start Guide - Payment Gateway

Get up and running in 2 minutes.

## Prerequisites
- Node.js 18+ installed
- pnpm, npm, or yarn

## Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open in browser
# Navigate to http://localhost:3000
```

## Test the Payment Gateway

### Test Case 1: Successful Payment ✅
```
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVV: 123
Name: John Doe
Amount: 100
Currency: INR

Result: Payment Successful (60% chance)
```

### Test Case 2: Failed Payment ❌
```
Same as above, but submit multiple times

Result: ~25% chance of failure
Reason: "Insufficient funds", "Card declined", etc.
Retry: Click "Retry" button (up to 3 times)
```

### Test Case 3: Timeout Payment ⏱️
```
Same as above, but wait 6+ seconds

Result: ~15% chance of timeout
Message: "Payment request timed out"
Retry: Click "Retry" button (up to 3 times)
```

### Test Case 4: Form Validation 🔍
```
1. Type partial card: "424242"
   → Error: "Card number must be 13-19 digits"

2. Type expiry: "13/25"
   → Error: "Month must be between 01 and 12"

3. Type CVV: "12" (only 2 digits)
   → Error: "CVV must be 3 digits"

4. Leave amount empty
   → Error: "Amount is required"

5. Submit button stays disabled until all errors fixed
```

### Test Case 5: Persistent History 💾
```
1. Make payment (success, fail, or timeout)
2. Transaction appears in right sidebar
3. Refresh page (Ctrl+R or Cmd+R)
4. Transaction still visible
5. Click transaction to see details
```

## Key Features

✅ **Real-time Validation**
- Per-field error messages
- Validates as you type
- Submit button disabled until form valid

✅ **Card Features**
- Auto-format card number (spaces every 4 digits)
- Detect card type (Visa/Mastercard/Amex)
- Smart CVV (3 digits or 4 for Amex)
- Live card preview

✅ **Payment Processing**
- Mock gateway with realistic behavior
- 60% success, 25% failure, 15% timeout
- Specific failure reasons
- Loading state during processing

✅ **Retry Logic**
- Up to 3 retry attempts
- Same transaction ID across retries
- Attempt counter display
- Disabled after 3 failures

✅ **Transaction History**
- Persists in localStorage
- Click to expand details
- View failure reasons
- See attempt count

✅ **Responsive Design**
- Works on mobile (375px)
- Works on tablet (768px)
- Works on desktop (1280px)

✅ **Accessibility**
- Form labels and ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

## File Structure

```
app/
  ├── api/pay/route.ts           # Mock payment API
  ├── layout.tsx                 # Root layout with Redux
  ├── page.tsx                   # Main payment page
  ├── providers.tsx              # Redux provider
  └── globals.css                # Styles

components/
  ├── CardPreview.tsx            # Live card display
  ├── PaymentForm.tsx            # Payment form
  ├── StatusScreen.tsx           # Success/failure modal
  ├── TransactionHistory.tsx     # Transaction list
  └── CurrencySelector.tsx       # Currency dropdown

hooks/
  ├── usePayment.ts              # Payment processing
  └── useCardForm.ts             # Form state management

store/
  ├── index.ts                   # Redux store setup
  └── paymentSlice.ts            # Redux payment state

utils/
  ├── cardUtils.ts               # Card formatting/detection
  ├── validation.ts              # Form validation (+ Luhn)
  └── storage.ts                 # localStorage helpers

types/
  └── index.ts                   # TypeScript interfaces

public/
  └── (static assets)
```

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Type check
pnpm type-check
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Page not loading?
```bash
# Kill existing process
pnpm dev
```

### Port already in use?
```bash
# Next.js will automatically try next port
# Or specify port explicitly
PORT=3001 pnpm dev
```

### localStorage not persisting?
- Ensure browser allows localStorage
- Clear browser cache (Ctrl+Shift+Delete)
- Check DevTools > Application > Storage

### Validation errors on valid input?
- Refresh page to reset form
- Check browser console for errors

## Next Steps

### For Production:
1. Replace mock API with real payment provider (Stripe, Razorpay)
2. Move transaction history to backend database
3. Add user authentication
4. Add email receipt sending
5. Set up webhook handling
6. Enable HTTPS
7. Add monitoring and analytics

### For Learning:
1. Read IMPLEMENTATION_NOTES.md for architecture details
2. Explore store/paymentSlice.ts for Redux patterns
3. Check hooks/useCardForm.ts for form state management
4. Review utils/validation.ts for validation logic
5. Study components/ for React patterns

## Support Files

- **README.md** - Full documentation
- **IMPLEMENTATION_NOTES.md** - Architecture & design decisions
- **This file** - Quick start guide

---

**Happy coding!** 🚀

For issues or questions, check the README.md for more detailed information.
