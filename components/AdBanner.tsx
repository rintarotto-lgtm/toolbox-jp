"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner() {
  const pushed = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAd, setHasAd] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

  useEffect(() => {
    if (!adsenseId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }

    // Check if ad actually rendered after a delay
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const ins = containerRef.current.querySelector("ins");
        if (ins && ins.offsetHeight > 0) {
          setHasAd(true);
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [adsenseId]);

  if (!adsenseId) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden transition-all duration-300 ${
        hasAd ? "my-4" : "my-0 max-h-0"
      }`}
    >
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
