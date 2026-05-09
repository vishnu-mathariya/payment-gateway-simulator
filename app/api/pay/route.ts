import { NextRequest, NextResponse } from 'next/server';

interface PaymentRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: string;
  transactionId: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
  currency: string;
  timestamp: number;
}

function simulateGatewayResponse(): { success: boolean; reason?: string; delay?: number } {
  const random = Math.random();

  // if (random < 0.6) {
  //   return { success: true };
  // }

  // if (random < 0.85) {
  //   const reasons = [
  //     'Insufficient funds',
  //     'Card declined',
  //     'Invalid card details',
  //     'Transaction limit exceeded',
  //     'Card expired',
  //   ];
  //   const reason = reasons[Math.floor(Math.random() * reasons.length)];
  //   return { success: false, reason };
  // }

  // return { success: false, delay: 8000 };

  return Response.json({
  status: "failed",
  reason: "Insufficient funds",
});
}

export async function POST(request: NextRequest): Promise<NextResponse<PaymentResult>> {
  try {
    const body: PaymentRequest = await request.json();

    const { cardholderName, cardNumber, expiryDate, cvv, amount, currency, transactionId } =
      body;

    if (
      !cardholderName ||
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !amount ||
      !currency ||
      !transactionId
    ) {
      return NextResponse.json(
        {
          success: false,
          transactionId,
          message: 'Missing required fields',
          amount,
          currency,
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }

    const gatewayResult = simulateGatewayResponse();

    if (gatewayResult.delay) {
      await new Promise((resolve) => setTimeout(resolve, gatewayResult.delay));
      return NextResponse.json(
        {
          success: false,
          transactionId,
          message: 'Request timed out',
          amount,
          currency,
          timestamp: Date.now(),
        },
        { status: 504 }
      );
    }

    if (gatewayResult.success) {
      return NextResponse.json(
        {
          success: true,
          transactionId,
          message: 'Payment successful',
          amount,
          currency,
          timestamp: Date.now(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        transactionId,
        message: gatewayResult.reason || 'Payment failed',
        amount,
        currency,
        timestamp: Date.now(),
      },
      { status: 402 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        transactionId: '',
        message,
        amount: 0,
        currency: 'INR',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
