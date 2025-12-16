"use client";
// =============================================================================
// Example PiButton React Functional Component
// Integrates Pi Network flows and UI using PiSdkBase (agnostic pattern)
// =============================================================================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PiSdkBase, PaymentData } from "pi-sdk-js";

export default function PiButton({ onConnected }: { onConnected?: () => void }) {
  const [connected, setConnected] = useState(false);
  const sdkRef = useRef<PiSdkBase | null>(null);

  useEffect(() => {
    const sdk = new PiSdkBase();
    sdk.onConnection = () => {
      setConnected(true);
      if (onConnected) onConnected();
    };
    sdkRef.current = sdk;
    sdk.connect();
    // optional: cleanup: () => { sdkRef.current = undefined }
  }, [onConnected]);

  const buy = useCallback(() => {
    const demoOrderId = Math.floor(10000 + Math.random() * 90000);
    const paymentData: PaymentData = {
      amount: 0.01,
      memo: "ConnecTo-Pi Admission",
      metadata: {
        description: "ConnecTo Admission",
        order_id: demoOrderId
      }
    };
    sdkRef.current?.createPayment(paymentData);
  }, []);

  return (
    <button
      disabled={!connected}
      onClick={buy}
      style={{
        backgroundColor: connected ? '#0d6efd' : '#ccc',
        color: connected ? '#fff' : '#888',
        cursor: connected ? 'pointer' : 'not-allowed',
        opacity: connected ? 1 : 0.7,
        border: 'none',
        padding: '0.5em 1.5em',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '1.1em',
        transition: 'background-color 0.12s, color 0.12s'
      }}
    >Buy</button>
  );
}
