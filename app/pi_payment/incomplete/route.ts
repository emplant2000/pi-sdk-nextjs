import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

export async function POST(req: NextRequest) {
  console.log('[PiSDK][incomplete] Handler invoked');
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

    let decision: 'complete' | 'cancel' = 'complete';
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
    } else {
      piResult = await postToPiServer(
        'cancel',
        paymentId,
        { paymentId },
        {
          logOk: `Pi payment cancelled for incomplete paymentId=${paymentId}`,
          logFail: `Pi cancel from incomplete failed for paymentId=${paymentId}`,
        }
      );
    }

    console.log('[PiSDK][incomplete] Pi server response:', piResult);

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

