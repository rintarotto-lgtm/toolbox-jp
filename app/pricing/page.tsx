"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLANS, type PlanType } from "@/lib/plans";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlan = ((session?.user as Record<string, unknown>)?.plan as string) || "FREE";

  const handleSubscribe = async (plan: PlanType) => {
    if (!session) {
      router.push("/auth/register");
      return;
    }

    if (plan === "FREE") return;

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(null);
    }
  };

  const planOrder: PlanType[] = ["FREE", "PRO", "TEAM"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">料金プラン</h1>
        <p className="text-gray-500 text-lg">
          無料で始めて、必要に応じてアップグレード
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planOrder.map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = currentPlan === planKey;
          const isPopular = planKey === "PRO";

          return (
            <div
              key={planKey}
              className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${
                isPopular
                  ? "border-blue-600 shadow-lg shadow-blue-100"
                  : "border-gray-200"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  人気No.1
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.nameJa}</p>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? "¥0" : `¥${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm">/月</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(planKey)}
                disabled={isCurrent || loading === planKey}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
                  isCurrent
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                } disabled:opacity-50`}
              >
                {isCurrent
                  ? "現在のプラン"
                  : loading === planKey
                  ? "処理中..."
                  : planKey === "FREE"
                  ? "無料で始める"
                  : "アップグレード"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-bold mb-4">よくある質問</h2>
        <div className="max-w-2xl mx-auto space-y-4 text-left">
          <details className="bg-white border border-gray-200 rounded-lg p-4">
            <summary className="font-medium text-gray-900 cursor-pointer">いつでもキャンセルできますか？</summary>
            <p className="mt-2 text-sm text-gray-600">はい、いつでもキャンセル可能です。キャンセル後も期間終了まで利用できます。</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg p-4">
            <summary className="font-medium text-gray-900 cursor-pointer">支払い方法は？</summary>
            <p className="mt-2 text-sm text-gray-600">クレジットカード（Visa、Mastercard、AMEX、JCB）に対応しています。Stripeによる安全な決済です。</p>
          </details>
          <details className="bg-white border border-gray-200 rounded-lg p-4">
            <summary className="font-medium text-gray-900 cursor-pointer">プランの変更はできますか？</summary>
            <p className="mt-2 text-sm text-gray-600">はい、いつでもプランの変更が可能です。アップグレード時は日割り計算されます。</p>
          </details>
        </div>
      </div>
    </div>
  );
}
