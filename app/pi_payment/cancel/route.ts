import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

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

    // Optionally: add DB logic here
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

