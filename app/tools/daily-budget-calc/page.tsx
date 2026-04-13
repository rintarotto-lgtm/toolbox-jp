"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const FIXED_COST_PRESETS = [
  { label: "家賃", amount: 0 },
  { label: "住宅ローン", amount: 0 },
  { label: "通信費（スマホ・ネット）", amount: 0 },
  { label: "保険料", amount: 0 },
  { label: "サブスク", amount: 0 },
  { label: "車関連（ローン・保険・駐車場）", amount: 0 },
  { label: "光熱費", amount: 0 },
];

export default function DailyBudgetCalcPage() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [fixedCosts, setFixedCosts] = useState<{ label: string; amount: number }[]>(FIXED_COST_PRESETS.map(f => ({ ...f })));
  const [savingsGoal, setSavingsGoal] = useState("0");
  const [daysInMonth, setDaysInMonth] = useState("30");

  const result = useMemo(() => {
    const income = parseFloat(monthlyIncome) * 10000;
    if (!income) return null;
    const totalFixed = fixedCosts.reduce((sum, f) => sum + (f.amount || 0) * 10000, 0);
    const savings = parseFloat(savingsGoal) * 10000 || 0;
    const days = parseInt(daysInMonth) || 30;
    const remaining = income - totalFixed - savings;
    const dailyBudget = remaining / days;

    return {
      income: Math.round(income),
      totalFixed: Math.round(totalFixed),
      savings: Math.round(savings),
      remaining: Math.round(remaining),
      dailyBudget: Math.round(dailyBudget),
      isNegative: dailyBudget < 0,
      fixedRatio: (totalFixed / income * 100).toFixed(0),
    };
  }, [monthlyIncome, fixedCosts, savingsGoal, daysInMonth]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  const updateFixedCost = (index: number, amount: string) => {
    setFixedCosts((prev) => prev.map((f, i) => i === index ? { ...f, amount: parseFloat(amount) || 0 } : f));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">1日の生活費・日割り予算計算</h1>
      <p className="text-gray-600 mb-6">月収と固定費から1日に使える自由なお金を計算します。</p>
      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月収・手取り（万円）</label>
            <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="例: 22" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目標貯金額（万円/月）</label>
            <input type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} placeholder="例: 3" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">固定費（万円/月）</label>
          <div className="space-y-2">
            {fixedCosts.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex-1">{f.label}</span>
                <input type="number" step="0.1" value={f.amount || ""} onChange={(e) => updateFixedCost(i, e.target.value)} placeholder="0" className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-xs text-gray-500">万</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`rounded-xl p-6 border text-center ${result.isNegative ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
            <p className="text-sm text-gray-600">1日に使える金額</p>
            <p className={`text-5xl font-bold ${result.isNegative ? "text-red-600" : "text-blue-600"}`}>
              ¥{formatNum(Math.abs(result.dailyBudget))}
            </p>
            {result.isNegative && <p className="text-red-600 text-sm mt-1">⚠️ 固定費が収入を超えています</p>}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-3">月間の内訳</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">月収（手取り）</span>
                <span className="font-bold text-gray-900">¥{formatNum(result.income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">固定費合計（{result.fixedRatio}%）</span>
                <span className="font-bold text-red-500">- ¥{formatNum(result.totalFixed)}</span>
              </div>
              {result.savings > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">先取り貯金</span>
                  <span className="font-bold text-blue-500">- ¥{formatNum(result.savings)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-800">自由に使えるお金</span>
                <span className={`font-bold text-xl ${result.isNegative ? "text-red-600" : "text-green-600"}`}>
                  ¥{formatNum(result.remaining)}
                </span>
              </div>
            </div>
          </div>

          {!result.isNegative && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-2">1日の予算目安</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "食費", pct: 0.4 },
                  { label: "交通費", pct: 0.15 },
                  { label: "娯楽・交際費", pct: 0.45 },
                ].map(({ label, pct }) => (
                  <div key={label} className="bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-bold text-green-700">¥{formatNum(Math.round(result.dailyBudget * pct))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">固定費の理想的な割合は？</h3><p className="text-sm text-gray-600 mt-1">手取りの50%以下が目安です。家賃が手取りの30%以内、その他固定費が20%以内に収めると生活に余裕が生まれます。</p></div>
          <div><h3 className="font-medium text-gray-900">先取り貯金の理想額は？</h3><p className="text-sm text-gray-600 mt-1">手取りの10〜20%が目標です。まずは5%（月収20万円なら1万円）から始めて、慣れたら増やしていくのが継続のコツです。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="daily-budget-calc" />
    </main>
  );
}
