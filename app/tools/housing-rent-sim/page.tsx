"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function HousingRentSimPage() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [incomeType, setIncomeType] = useState<"gross" | "net">("net");
  const [householdType, setHouseholdType] = useState<"single" | "couple" | "family">("single");
  const [currentRent, setCurrentRent] = useState("");

  const result = useMemo(() => {
    const income = parseFloat(monthlyIncome);
    if (!income) return null;

    const netIncome = incomeType === "gross" ? income * 0.78 : income;

    const ratios = {
      single: { ideal: 0.25, max: 0.33 },
      couple: { ideal: 0.20, max: 0.25 },
      family: { ideal: 0.18, max: 0.22 },
    };
    const ratio = ratios[householdType];

    const idealRent = netIncome * ratio.ideal;
    const maxRent = netIncome * ratio.max;

    const initialCost = {
      low: maxRent * 4,
      mid: maxRent * 5,
      high: maxRent * 6,
    };

    const currentRentNum = parseFloat(currentRent);
    const currentRatio = currentRentNum ? (currentRentNum / netIncome * 100).toFixed(1) : null;
    const isOverBudget = currentRentNum ? currentRentNum > maxRent : false;

    return {
      netIncome: Math.round(netIncome),
      idealRent: Math.round(idealRent),
      maxRent: Math.round(maxRent),
      initialCost,
      currentRatio,
      isOverBudget,
      remaining: Math.round(netIncome - (currentRentNum || maxRent)),
    };
  }, [monthlyIncome, incomeType, householdType, currentRent]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  const householdLabels = { single: "一人暮らし", couple: "2人暮らし", family: "ファミリー" };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">家賃シミュレーター・適正家賃計算</h1>
      <p className="text-gray-600 mb-6">収入から無理のない家賃の上限と初期費用の目安を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">世帯タイプ</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(householdLabels) as (keyof typeof householdLabels)[]).map((k) => (
              <button key={k} onClick={() => setHouseholdType(k)}
                className={`py-2 rounded-lg font-medium text-sm ${householdType === k ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                {householdLabels[k]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月収（円）</label>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setIncomeType("net")} className={`px-3 py-1 rounded text-sm border ${incomeType === "net" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>手取り</button>
            <button onClick={() => setIncomeType("gross")} className={`px-3 py-1 rounded text-sm border ${incomeType === "gross" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>額面</button>
          </div>
          <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="例: 200000" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の家賃（確認用・任意）</label>
          <input type="number" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} placeholder="例: 70000" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4">適正家賃</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">理想（手取りの{householdType === "single" ? "25" : householdType === "couple" ? "20" : "18"}%）</p>
                <p className="text-2xl font-bold text-green-600">¥{formatNum(result.idealRent)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">上限（手取りの{householdType === "single" ? "33" : householdType === "couple" ? "25" : "22"}%）</p>
                <p className="text-2xl font-bold text-blue-600">¥{formatNum(result.maxRent)}</p>
              </div>
            </div>
          </div>
          {result.currentRatio && (
            <div className={`rounded-xl p-4 border ${result.isOverBudget ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <p className={`text-sm font-medium ${result.isOverBudget ? "text-red-800" : "text-green-800"}`}>
                現在の家賃は手取りの{result.currentRatio}% {result.isOverBudget ? "⚠️ 上限を超えています" : "✅ 適正範囲内"}
              </p>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-3">初期費用の目安（家賃¥{formatNum(result.maxRent)}の場合）</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-500">最安（4ヶ月）</p>
                <p className="text-lg font-bold text-gray-700">¥{formatNum(Math.round(result.initialCost.low))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">標準（5ヶ月）</p>
                <p className="text-lg font-bold text-blue-600">¥{formatNum(Math.round(result.initialCost.mid))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">最高（6ヶ月）</p>
                <p className="text-lg font-bold text-gray-700">¥{formatNum(Math.round(result.initialCost.high))}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">手取り20万円の適正家賃は？</h3><p className="text-sm text-gray-600 mt-1">一人暮らしなら5〜6.6万円が目安です。理想は5万円（25%）、上限は6.6万円（33%）です。東京では7〜8万円以上の物件が多いですが、家賃補助や同居を検討するのも選択肢です。</p></div>
          <div><h3 className="font-medium text-gray-900">礼金・仲介手数料を節約できますか？</h3><p className="text-sm text-gray-600 mt-1">礼金ゼロ物件を探す、仲介手数料が半額または無料の業者を使う、フリーレント交渉をするなどで初期費用を抑えられます。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="housing-rent-sim" />
    </main>
  );
}
