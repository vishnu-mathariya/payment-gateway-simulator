# Payment Gateway UI

A responsive payment gateway UI built using Next.js, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

* Real-time form validation
* Card type detection (Visa, Mastercard, Amex)
* Live card preview
* Payment lifecycle handling
* Retry logic with max 3 attempts
* Timeout handling using AbortController
* Transaction history with localStorage
* Responsive design for mobile and desktop

## Tech Stack

* Next.js (App Router)
* TypeScript
* Redux Toolkit
* Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Notes

* Payments are simulated using a mock API route.
* Transaction history persists using localStorage.
* No third-party payment SDK is used.

## Folder Structure

* components/
* hooks/
* store/
* utils/
* types/
* app/api/

## Improvements

Given more time:

* Add unit tests
* Improve accessibility
* Add real payment gateway integration
* Add backend database support
