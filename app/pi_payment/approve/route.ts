import { NextRequest, NextResponse } from 'next/server';
import { postToPiServer } from '@/lib/piServer';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { accessToken, paymentId } = payload;

    console.log(`[PiSDK][approve] Incoming request payload:`, payload);

    if (!accessToken || !paymentId) {
      console.warn(`[PiSDK][approve] Missing params: accessToken or paymentId. Payload was:`, payload);
      return NextResponse.json(
        { error: "Missing required params: accessToken, paymentId" },
        { status: 400 }
      );
    }

    // Optionally: lookup and create user/transaction locally (demo/stubbed here)
    // TODO: Implement user lookup, transaction creation, as needed by your business rules

    // Call the Pi server API, logging ok/fail
    const piResult = await postToPiServer(
      'approve',
      paymentId,
      { paymentId, accessToken },
      {
        logOk: `Pi payment approved for paymentId=${paymentId}`,
        logFail: `Pi approve error for paymentId=${paymentId}`,
      }
    );

    console.log(`[PiSDK][approve] Sent to Pi server. Received:`, piResult);

    // Return Pi server response (plus echo back input for debugging)
    return NextResponse.json({
      result: 'approved',
      paymentId,
      piServer: piResult.response
    });
  } catch (error) {
    console.error(`[PiSDK][approve] Error in handler:`, error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
