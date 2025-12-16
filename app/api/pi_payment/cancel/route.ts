import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

// This replicates the server-side logic of PiPaymentController#cancel for the Next.js API route.

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { paymentId } = payload;

    console.log('[PiSDK][cancel] Incoming request payload:', payload);

    if (!paymentId) {
      console.warn('[PiSDK][cancel] Missing paymentId in payload.');
      return NextResponse.json({
        error: 'Missing required parameter: paymentId',
      }, { status: 400 });
    }

    // TODO (if using a DB):
    // - Lookup payment (by paymentId). If not found, return unauthorized/error.
    // - Optionally update payment/transaction state in your local DB (e.g., mark as cancel_pending).

    // Notify Pi server of the cancel event
    const piResult = await postToPiServer(
      'cancel',
      paymentId,
      { paymentId },
      {
        logOk: `Pi payment cancelled for paymentId=${paymentId}`,
        logFail: `Pi cancel error for paymentId=${paymentId}`,
      }
    );

    console.log('[PiSDK][cancel] Pi server response:', piResult);

    // Return Pi server response
    return NextResponse.json({
      result: 'cancelled',
      paymentId,
      piServer: piResult.response
    });
  } catch (err) {
    console.error('[PiSDK][cancel] Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

