interface PiServerOptions {
  logOk?: string;
  logFail?: string;
  headers?: Record<string, string>;
}

export async function postToPiServer(
  action: string,
  paymentId: string,
  body: object = {},
  opts: PiServerOptions = {}
): Promise<{ response: any; status: number }> {
  // PI_API_KEY must be provided as a Unix environment variable
  const API_URL_BASE = process.env.PI_API_URL_BASE || "https://api.minepi.com";
  const API_VERSION = process.env.PI_API_VERSION || "v2";
  const API_CONTROLLER = process.env.PI_API_CONTROLLER || "payments";
  const API_KEY = process.env.PI_API_KEY;

  if (!API_KEY) {
    throw new Error(
      "[PiSDK] PI_API_KEY environment variable is required for Pi server requests!"
    );
  }

  const url = `${API_URL_BASE}/${API_VERSION}/${API_CONTROLLER}/${paymentId}/${action}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${API_KEY}`,
    ...opts.headers,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const resJson = await res.json();
    if (opts.logOk) {
      console.log(`[PiSDK][${action}][OK]:`, opts.logOk, resJson);
    }
    return { response: resJson, status: res.status };
  } catch (error: any) {
    if (opts.logFail) {
      console.error(`[PiSDK][${action}][FAIL]:`, opts.logFail, error);
    }
    return { response: { error: error.message }, status: 502 };
  }
}
