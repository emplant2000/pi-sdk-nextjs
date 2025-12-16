import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

// This replicates the server-side logic of PiPaymentController#error for the Next.js API route.

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { paymentId, error: errorData } = payload;

    console.log('[PiSDK][error] Incoming request payload:', payload);

    if (!paymentId || !errorData) {
      console.warn('[PiSDK][error] Missing paymentId or error in payload.');
      return NextResponse.json({
        error: 'Missing required parameters: paymentId, error',
      }, { status: 400 });
    }

    // TODO (if using a DB):
    // - Lookup payment (by paymentId). If not found, return unauthorized/error.
    // - Optionally update payment/transaction state in your local DB (e.g., mark as error).
    // - Optionally log error details to your logging system or database.

    // Notify Pi server of the error (uncomment if Pi expects server callback)
    const piResult = await postToPiServer(
      'error',
      paymentId,
      { paymentId, error: errorData },
      {
        logOk: `Pi payment error reported for paymentId=${paymentId}`,
        logFail: `Pi error report failed for paymentId=${paymentId}`,
      }
    );

    console.log('[PiSDK][error] Pi server response:', piResult);

    // Return Pi server response
    return NextResponse.json({
      result: 'error-recorded',
      paymentId,
      piServer: piResult.response
    });
  } catch (err) {
    console.error('[PiSDK][error] Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
