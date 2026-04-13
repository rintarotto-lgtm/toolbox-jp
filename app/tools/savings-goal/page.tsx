"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const PRESETS = [
  { label: "マイホーム頭金", amount: 300, icon: "🏠" },
  { label: "結婚資金", amount: 300, icon: "💒" },
  { label: "車購入", amount: 200, icon: "🚗" },
  { label: "教育資金", amount: 500, icon: "🎓" },
  { label: "老後資金", amount: 2000, icon: "👴" },
  { label: "海外旅行", amount: 50, icon: "✈️" },
];

export default function SavingsGoalPage() {
  const [goalAmount, setGoalAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("0");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [interestRate, setInterestRate] = useState("0.1");
  const [mode, setMode] = useState<"period" | "monthly">("period");
  const [targetMonths, setTargetMonths] = useState("60");

  const result = useMemo(() => {
    const goal = parseFloat(goalAmount) * 10000;
    const current = parseFloat(currentSavings) * 10000 || 0;
    const rate = parseFloat(interestRate) / 100 / 12;
    const needed = goal - current;
    if (!goal || needed <= 0) return null;

    if (mode === "period") {
      const monthly = parseFloat(monthlyAmount) * 10000;
      if (!monthly) return null;
      if (rate > 0) {
        const months = Math.ceil(Math.log(1 + (needed * rate) / monthly) / Math.log(1 + rate));
        const totalPaid = monthly * months;
        const interest = totalPaid - needed;
        return { months, years: Math.floor(months / 12), remainMonths: months % 12, totalPaid: Math.round(totalPaid), interest: Math.round(interest), monthly: Math.round(monthly) };
      } else {
        const months = Math.ceil(needed / monthly);
        return { months, years: Math.floor(months / 12), remainMonths: months % 12, totalPaid: Math.round(monthly * months), interest: 0, monthly: Math.round(monthly) };
      }
    } else {
      const months = parseInt(targetMonths);
      if (!months) return null;
      let monthly: number;
      if (rate > 0) {
        monthly = needed * rate / (Math.pow(1 + rate, months) - 1);
      } else {
        monthly = needed / months;
      }
      const totalPaid = monthly * months;
      const interest = totalPaid - needed;
      return { months, years: Math.floor(months / 12), remainMonths: months % 12, totalPaid: Math.round(totalPaid), interest: Math.round(interest), monthly: Math.round(monthly) };
    }
  }, [goalAmount, currentSavings, monthlyAmount, interestRate, mode, targetMonths]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">貯金目標達成計算</h1>
      <p className="text-gray-600 mb-6">目標金額・月々の積立から達成期間を計算します。</p>
      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">目標（プリセット）</label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setGoalAmount(String(p.amount))}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${goalAmount === String(p.amount) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                {p.icon} {p.label}<br />({p.amount}万円)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目標金額（万円）</label>
            <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="例: 300" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在の貯金（万円）</label>
            <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">計算モード</label>
          <div className="flex gap-2">
            <button onClick={() => setMode("period")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "period" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>月額→達成期間</button>
            <button onClick={() => setMode("monthly")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>期間→必要月額</button>
          </div>
        </div>

        {mode === "period" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月々の積立額（万円）</label>
            <input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} placeholder="例: 5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">目標達成期間</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {[12,24,36,60,120,180,240].map((m) => (
                <button key={m} onClick={() => setTargetMonths(String(m))}
                  className={`px-3 py-1 rounded text-sm border ${targetMonths === String(m) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                  {m >= 12 ? `${m/12}年` : `${m}ヶ月`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年利（%）</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          {mode === "period" ? (
            <div className="bg-white rounded-xl p-5 text-center mb-4">
              <p className="text-sm text-gray-600">目標達成まで</p>
              <p className="text-4xl font-bold text-blue-600">
                {result.years > 0 ? `${result.years}年` : ""}{result.remainMonths > 0 ? `${result.remainMonths}ヶ月` : ""}
              </p>
              <p className="text-gray-500 text-sm mt-1">（{result.months}ヶ月）</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-5 text-center mb-4">
              <p className="text-sm text-gray-600">必要な月々の積立額</p>
              <p className="text-4xl font-bold text-blue-600">¥{formatNum(result.monthly)}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">積立総額</p>
              <p className="text-xl font-bold text-gray-700">¥{formatNum(result.totalPaid)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">利息収入</p>
              <p className="text-xl font-bold text-green-600">+¥{formatNum(result.interest)}</p>
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">月3万円貯金すると1年でいくら貯まる？</h3><p className="text-sm text-gray-600 mt-1">月3万円×12ヶ月=36万円です。5年で180万円、10年で360万円になります。高金利の定期預金やNISAを活用すると利息分だけ増えます。</p></div>
          <div><h3 className="font-medium text-gray-900">緊急資金はいくら必要ですか？</h3><p className="text-sm text-gray-600 mt-1">生活費の3〜6ヶ月分が目安です。月20万円の生活費なら60〜120万円を流動性の高い口座に保有しておきましょう。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="savings-goal" />
    </main>
  );
}
