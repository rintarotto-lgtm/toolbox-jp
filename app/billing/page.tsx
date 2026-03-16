"use client";

import { Suspense } from "react";
import { usePlan } from "@/lib/hooks/use-plan";
import { PLANS } from "@/lib/plans";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

function BillingContent() {
  const { plan, isAuthenticated, isLoading } = usePlan();
  const [portalLoading, setPortalLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const planConfig = PLANS[plan];

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("エラーが発生しました");
    } finally {
      setPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
        <Link href="/auth/signin" className="text-blue-600 hover:underline">ログインする</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">請求管理</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          サブスクリプションが正常に登録されました！
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">現在のプラン</h2>
            <p className="text-gray-500 text-sm">
              {planConfig.nameJa} — {planConfig.priceLabel}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            plan === "FREE" ? "bg-gray-100 text-gray-600" :
            plan === "PRO" ? "bg-blue-100 text-blue-700" :
            "bg-purple-100 text-purple-700"
          }`}>
            {plan}
          </span>
        </div>

        <ul className="space-y-2 mb-6">
          {planConfig.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span> {f}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          {plan === "FREE" ? (
            <Link
              href="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              アップグレード
            </Link>
          ) : (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {portalLoading ? "読み込み中..." : "Stripeポータルを開く"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center animate-pulse">読み込み中...</div>}>
      <BillingContent />
    </Suspense>
  );
}
