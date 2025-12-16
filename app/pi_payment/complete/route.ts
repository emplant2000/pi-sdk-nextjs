import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

// This replicates the server-side logic of PiPaymentController#complete for the Next.js API route.

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { paymentId, transactionId } = payload;

    console.log('[PiSDK][complete] Incoming request payload:', payload);

    if (!paymentId || !transactionId) {
      console.warn('[PiSDK][complete] Missing paymentId or transactionId.');
      return NextResponse.json({
        error: 'Missing required parameters: paymentId, transactionId',
      }, { status: 400 });
    }

    // TODO (if using a DB):
    // - Lookup payment (by paymentId). If not found, return unauthorized/error.
    // - Optionally update payment/transaction state in your local DB.
    //   E.g., set TXID, mark as completion_pending, log as appropriate.

    // Notify Pi server of the completion event
    const piResult = await postToPiServer(
      'complete',
      paymentId,
      { paymentId, txid: transactionId },
      {
        logOk: `Pi payment completed for paymentId=${paymentId}, transactionId=${transactionId}`,
        logFail: `Pi complete error for paymentId=${paymentId}, transactionId=${transactionId}`,
      }
    );

    console.log('[PiSDK][complete] Pi server response:', piResult);

    // Return Pi server response (plus echo back input for debugging)
    return NextResponse.json({
      result: 'completed',
      paymentId,
      transactionId,
      piServer: piResult.response
    });
  } catch (err) {
    console.error('[PiSDK][complete] Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
