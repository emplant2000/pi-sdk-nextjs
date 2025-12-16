import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { accessToken, paymentId, errorMessage } = payload;

    if (!accessToken || !paymentId) {
      return NextResponse.json(
        { error: "Missing required params: accessToken, paymentId" },
        { status: 400 }
      );
    }

    // Optionally: store error event locally, then notify Pi server
    const piResult = await postToPiServer(
      'error',
      paymentId,
      { paymentId, accessToken, errorMessage },
      {
        logOk: `Pi payment error logged for paymentId=${paymentId}`,
        logFail: `Pi error log failed for paymentId=${paymentId}`,
      }
    );

    return NextResponse.json({
      result: 'error-logged',
      paymentId,
      piServer: piResult.response
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
