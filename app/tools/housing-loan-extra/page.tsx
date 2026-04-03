"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function HousingLoanExtraPage() {
  const [loanBalance, setLoanBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [remainingYears, setRemainingYears] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [repayType, setRepayType] = useState<"shorten" | "reduce">("shorten");

  const result = useMemo(() => {
    const balance = parseFloat(loanBalance.replace(/,/g, "")) * 10000;
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(remainingYears) * 12;
    const extra = parseFloat(extraPayment.replace(/,/g, "")) * 10000;

    if (!balance || !rate || !months || !extra) return null;

    // Current monthly payment
    const monthlyPayment = balance * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);

    // Total interest without extra payment
    const totalWithout = monthlyPayment * months - balance;

    // After extra payment
    const newBalance = balance - extra;
    if (newBalance <= 0) return { error: "繰上返済額がローン残高を超えています" };

    let shortenedMonths = 0;
    let reducedMonthly = 0;
    let totalInterestShorten = 0;
    let totalInterestReduce = 0;

    if (repayType === "shorten") {
      // Same monthly payment, shorter period
      shortenedMonths = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - newBalance * rate)) / Math.log(1 + rate));
      totalInterestShorten = monthlyPayment * shortenedMonths - newBalance;
      const savedInterest = totalWithout - totalInterestShorten;
      const savedMonths = months - shortenedMonths;
      return {
        type: "shorten",
        monthlyPayment: Math.round(monthlyPayment),
        originalMonths: months,
        newMonths: shortenedMonths,
        savedMonths,
        savedYears: Math.floor(savedMonths / 12),
        savedMonthsRemainder: savedMonths % 12,
        savedInterest: Math.round(savedInterest),
        totalInterestNew: Math.round(totalInterestShorten),
        totalInterestOld: Math.round(totalWithout),
      };
    } else {
      // Same period, lower monthly payment
      reducedMonthly = newBalance * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      totalInterestReduce = reducedMonthly * months - newBalance;
      const savedInterest = totalWithout - totalInterestReduce;
      const monthlyDiff = monthlyPayment - reducedMonthly;
      return {
        type: "reduce",
        monthlyPayment: Math.round(monthlyPayment),
        newMonthlyPayment: Math.round(reducedMonthly),
        monthlyReduction: Math.round(monthlyDiff),
        originalMonths: months,
        newMonths: months,
        savedMonths: 0,
        savedInterest: Math.round(savedInterest),
        totalInterestNew: Math.round(totalInterestReduce),
        totalInterestOld: Math.round(totalWithout),
      };
    }
  }, [loanBalance, interestRate, remainingYears, extraPayment, repayType]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">住宅ローン繰上返済シミュレーター</h1>
      <p className="text-gray-600 mb-6">繰上返済による利息節約額・期間短縮効果を計算します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在のローン残高（万円）</label>
            <input type="number" value={loanBalance} onChange={(e) => setLoanBalance(e.target.value)} placeholder="例: 3000" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金利（年率%）</label>
            <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="例: 0.5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">残り返済年数</label>
            <input type="number" value={remainingYears} onChange={(e) => setRemainingYears(e.target.value)} placeholder="例: 25" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">繰上返済額（万円）</label>
            <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="例: 100" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">繰上返済タイプ</label>
          <div className="flex gap-2">
            <button onClick={() => setRepayType("shorten")} className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${repayType === "shorten" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              期間短縮型（おすすめ）
            </button>
            <button onClick={() => setRepayType("reduce")} className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${repayType === "reduce" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              返済額軽減型
            </button>
          </div>
        </div>
      </div>

      {result && !("error" in result) && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">繰上返済効果</h2>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4 text-center">
            <p className="text-sm text-green-700">利息節約額</p>
            <p className="text-4xl font-bold text-green-600">¥{formatNum(result.savedInterest)}</p>
            {result.type === "shorten" && result.savedYears !== undefined && (
              <p className="text-sm text-green-700 mt-1">
                返済期間 {result.savedYears}年{result.savedMonthsRemainder}ヶ月短縮
              </p>
            )}
            {result.type === "reduce" && result.monthlyReduction !== undefined && (
              <p className="text-sm text-green-700 mt-1">
                毎月の返済額 ¥{formatNum(result.monthlyReduction)} 減少
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500">繰上返済前・総利息</p>
              <p className="text-xl font-bold text-red-500">¥{formatNum(result.totalInterestOld)}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500">繰上返済後・総利息</p>
              <p className="text-xl font-bold text-blue-600">¥{formatNum(result.totalInterestNew)}</p>
            </div>
            {result.type === "shorten" && (
              <>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-500">当初返済期間</p>
                  <p className="text-xl font-bold text-gray-700">{Math.floor(result.originalMonths / 12)}年{result.originalMonths % 12}ヶ月</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-500">短縮後返済期間</p>
                  <p className="text-xl font-bold text-blue-600">{Math.floor(result.newMonths / 12)}年{result.newMonths % 12}ヶ月</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {result && "error" in result && (
        <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-red-700">{result.error}</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">期間短縮と返済額軽減、どちらを選ぶべき？</h3>
            <p className="text-sm text-gray-600 mt-1">利息節約効果は期間短縮型が大きいです。ただし収入が不安定な方は毎月の負担を減らす返済額軽減型も一つの選択肢です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">繰上返済のベストタイミングは？</h3>
            <p className="text-sm text-gray-600 mt-1">返済初期ほど効果大。ただし手元資金を残すことも重要。生活費6ヶ月分は手元に置き、残りを繰上返済に充てるのが目安です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">住宅ローン控除期間中は繰上返済しない方がいい？</h3>
            <p className="text-sm text-gray-600 mt-1">住宅ローン控除（年末残高の0.7%）がある場合、低金利ローンでは控除メリットの方が大きいケースがあります。控除期間終了後の繰上返済が有利なことも多いです。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="housing-loan-extra" />
    </main>
  );
}
