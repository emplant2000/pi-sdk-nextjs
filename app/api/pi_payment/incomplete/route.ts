import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

// This replicates the logic of PiPaymentController#incomplete for the Next.js API route.
// Logic: decide (optionally user-override) whether to complete or cancel an incomplete payment.

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { paymentId, transactionId } = payload;

    console.log('[PiSDK][incomplete] Incoming request payload:', payload);

    if (!paymentId || !transactionId) {
      console.warn('[PiSDK][incomplete] Missing paymentId or transactionId in payload.');
      return NextResponse.json({
        error: 'Missing required parameters: paymentId, transactionId',
      }, { status: 400 });
    }

    // Decision logic: should we complete or cancel this payment? Replace this
    // with database lookups or business logic if desired. Default: always complete.
    let decision: 'complete' | 'cancel' = 'complete'; // <-- customize as needed
    // Example: if (await customIncompleteLogic(paymentId, transactionId)) { ... }

    let piResult = null;
    if (decision === 'complete') {
      piResult = await postToPiServer(
        'complete',
        paymentId,
        { paymentId, txid: transactionId },
        {
          logOk: `Pi payment completed for incomplete paymentId=${paymentId}, transactionId=${transactionId}`,
          logFail: `Pi completion from incomplete failed for paymentId=${paymentId}`,
        }
      );
    } else if (decision === 'cancel') {
      piResult = await postToPiServer(
        'cancel',
        paymentId,
        { paymentId },
        {
          logOk: `Pi payment cancelled for incomplete paymentId=${paymentId}`,
          logFail: `Pi cancel from incomplete failed for paymentId=${paymentId}`,
        }
      );
    } else {
      return NextResponse.json({ error: 'Invalid decision on incomplete payment' }, { status: 400 });
    }

    console.log('[PiSDK][incomplete] Pi server response:', piResult);

    // Return Pi server response and decision
    return NextResponse.json({
      result: `incomplete-${decision}`,
      paymentId,
      transactionId,
      piServer: piResult?.response
    });
  } catch (err) {
    console.error('[PiSDK][incomplete] Error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

