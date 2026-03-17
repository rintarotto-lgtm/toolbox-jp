"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner() {
  const pushed = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

  useEffect(() => {
    if (!adsenseId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [adsenseId]);

  if (!adsenseId) {
    return (
      <div className="my-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-dashed border-blue-200 rounded-lg p-4 text-center text-sm text-blue-400">
        <p>📢 広告スペース（AdSense設定後に表示）</p>
      </div>
    );
  }

  return (
    <div className="my-4 min-h-0 overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 0 }}
        data-ad-client={adsenseId}
        data-ad-slot={process.env.NEXT_PUBLIC_AD_SLOT || ""}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
