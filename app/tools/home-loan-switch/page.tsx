"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── 元利均等返済 月返済額 ─── */
function calcMonthlyPayment(
  principalYen: number,
  annualRate: number,
  totalMonths: number
): number {
  if (principalYen <= 0 || totalMonths <= 0) return 0;
  if (annualRate === 0) return principalYen / totalMonths;
  const r = annualRate / 100 / 12;
  return (
    (principalYen * r * Math.pow(1 + r, totalMonths)) /
    (Math.pow(1 + r, totalMonths) - 1)
  );
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

export default function HomeLoanSwitchPage() {
  // 現在のローン
  const [currentDebtMan, setCurrentDebtMan] = useState(2500); // 万円
  const [currentRate, setCurrentRate] = useState(1.5); // %
  const [remainYears, setRemainYears] = useState(25);
  const [remainMonths, setRemainMonths] = useState(0);
  const [rateType, setRateType] = useState<"変動" | "固定">("変動");

  // 借り換え後
  const [newRate, setNewRate] = useState(0.6); // %
  const [useCustomPeriod, setUseCustomPeriod] = useState(false);
  const [customYears, setCustomYears] = useState(25);
  const [switchCostMan, setSwitchCostMan] = useState(60); // 諸費用

  const results = useMemo(() => {
    const principalYen = currentDebtMan * 10000;
    const totalRemainMonths = remainYears * 12 + remainMonths;
    const newTotalMonths = useCustomPeriod
      ? customYears * 12
      : totalRemainMonths;

    if (totalRemainMonths <= 0 || principalYen <= 0) {
      return null;
    }

    // 現在の月返済額
    const currentMonthly = calcMonthlyPayment(
      principalYen,
      currentRate,
      totalRemainMonths
    );
    const currentTotalYen = currentMonthly * totalRemainMonths;
    const currentInterestYen = currentTotalYen - principalYen;

    // 借り換え後の月返済額
    const switchCostYen = switchCostMan * 10000;
    const newMonthly = calcMonthlyPayment(principalYen, newRate, newTotalMonths);
    const newTotalYen = newMonthly * newTotalMonths + switchCostYen;
    const newInterestYen = newTotalYen - principalYen;

    // 月々削減額
    const monthlyReduction = currentMonthly - newMonthly;

    // 総利息削減額
    const totalInterestReduction = currentInterestYen - newInterestYen + switchCostYen;
    // 諸費用を除いた純粋な利息削減
    const pureInterestReduction = currentInterestYen - (newMonthly * newTotalMonths - principalYen);

    // 諸費用回収期間 (月)
    const recoveryMonths =
      monthlyReduction > 0 ? switchCostYen / monthlyReduction : Infinity;
    const recoveryYears = recoveryMonths / 12;

    // 総コスト差
    const totalCostDiff = currentTotalYen - newTotalYen;

    // 判定
    let verdict: "お得" | "微妙" | "不利";
    let verdictColor: string;
    if (totalCostDiff > 0 && recoveryYears < totalRemainMonths / 12) {
      verdict = "お得";
      verdictColor = "text-green-600 bg-green-50 border-green-400";
    } else if (totalCostDiff > 0) {
      verdict = "微妙";
      verdictColor = "text-yellow-600 bg-yellow-50 border-yellow-400";
    } else {
      verdict = "不利";
      verdictColor = "text-red-600 bg-red-50 border-red-400";
    }

    // 年別累計節約額
    const yearCount = Math.ceil(totalRemainMonths / 12);
    const yearlyData = Array.from({ length: Math.min(yearCount, 30) }, (_, i) => {
      const yr = i + 1;
      const months = yr * 12;
      const currentCum = currentMonthly * Math.min(months, totalRemainMonths);
      const newCum =
        newMonthly * Math.min(months, newTotalMonths) + switchCostYen;
      return { yr, saving: currentCum - newCum };
    });

    return {
      currentMonthly,
      newMonthly,
      monthlyReduction,
      currentInterestYen,
      pureInterestReduction,
      totalCostDiff,
      switchCostYen,
      recoveryMonths,
      recoveryYears,
      verdict,
      verdictColor,
      yearlyData,
      totalRemainMonths,
    };
  }, [
    currentDebtMan,
    currentRate,
    remainYears,
    remainMonths,
    newRate,
    useCustomPeriod,
    customYears,
    switchCostMan,
  ]);

  const maxAbsSaving = results
    ? Math.max(...results.yearlyData.map((d) => Math.abs(d.saving)), 1)
    : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 mb-8 text-white">
        <div className="text-4xl mb-2">🏡</div>
        <h1 className="text-2xl font-bold mb-1">住宅ローン借り換えシミュレーター</h1>
        <p className="text-sm opacity-90">
          借り換えの利息削減効果・諸費用回収期間・損益を自動判定
        </p>
      </div>

      {/* 現在のローン */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">現在のローン</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在の残債 (万円)
            </label>
            <input
              type="number"
              min={0}
              value={currentDebtMan}
              onChange={(e) => setCurrentDebtMan(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在の金利 (%/年)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={currentRate}
              onChange={(e) => setCurrentRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              残返済期間
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                max={35}
                value={remainYears}
                onChange={(e) => setRemainYears(parseInt(e.target.value) || 0)}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="flex items-center text-sm text-gray-600">年</span>
              <input
                type="number"
                min={0}
                max={11}
                value={remainMonths}
                onChange={(e) => setRemainMonths(parseInt(e.target.value) || 0)}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="flex items-center text-sm text-gray-600">ヶ月</span>
            </div>
          </div>

          {/* 月返済額（自動計算） */}
          {results && (
            <div className="flex flex-col justify-end">
              <label className="block text-sm text-gray-500 mb-1">
                現在の月返済額（自動計算）
              </label>
              <div className="text-xl font-bold text-gray-800">
                {formatYen(results.currentMonthly)}
              </div>
            </div>
          )}
        </div>

        {/* 金利タイプ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            金利タイプ
          </label>
          <div className="flex gap-2">
            {(["変動", "固定"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setRateType(t)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                  rateType === t
                    ? "bg-blue-100 border-blue-400 text-blue-800 font-medium"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                {t}金利
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 借り換え後 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">借り換え後の条件</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しい金利 (%/年)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={newRate}
              onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {results && (
              <p className="text-xs text-gray-400 mt-1">
                金利差: {(currentRate - newRate).toFixed(2)}%
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              諸費用 (万円)
            </label>
            <input
              type="number"
              min={0}
              value={switchCostMan}
              onChange={(e) => setSwitchCostMan(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-400 mt-1">目安: 50〜100万円</p>
          </div>
        </div>

        {/* 返済期間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            返済期間
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setUseCustomPeriod(false)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                !useCustomPeriod
                  ? "bg-blue-100 border-blue-400 text-blue-800 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              残期間と同じ
            </button>
            <button
              onClick={() => setUseCustomPeriod(true)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                useCustomPeriod
                  ? "bg-blue-100 border-blue-400 text-blue-800 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              カスタム
            </button>
          </div>
          {useCustomPeriod && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                max={35}
                value={customYears}
                onChange={(e) => setCustomYears(parseInt(e.target.value) || 1)}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-600">年</span>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4 mb-6">
          <h2 className="font-bold text-gray-800 text-lg">計算結果</h2>

          {/* 判定バナー */}
          <div
            className={`rounded-xl border-2 p-5 text-center ${results.verdictColor}`}
          >
            <div className="text-3xl font-bold mb-1">
              {results.verdict === "お得" && "借り換えお得！"}
              {results.verdict === "微妙" && "借り換え微妙"}
              {results.verdict === "不利" && "借り換え不利"}
            </div>
            <div className="text-sm">
              {results.verdict === "お得"
                ? `回収期間（${results.recoveryYears.toFixed(1)}年）が残返済期間より短く、借り換えが有利です`
                : results.verdict === "微妙"
                ? "トータルコストはお得ですが、回収期間が長めです"
                : "借り換え後のトータルコストが現在より高くなります"}
            </div>
          </div>

          {/* 月返済額比較 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">月々の返済額</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
                <div className="text-xl font-bold text-gray-700">
                  {formatYen(results.currentMonthly)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">現在</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
                <div className="text-xl font-bold text-blue-700">
                  {formatYen(results.newMonthly)}
                </div>
                <div className="text-xs text-blue-500 mt-0.5">借り換え後</div>
              </div>
            </div>
            <div
              className={`mt-3 text-center text-sm font-bold ${
                results.monthlyReduction > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              月々{" "}
              {results.monthlyReduction >= 0 ? "" : "▲"}
              {formatYen(Math.abs(results.monthlyReduction))}{" "}
              {results.monthlyReduction >= 0 ? "の削減" : "の増加"}
            </div>
          </div>

          {/* 総利息・諸費用 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">総コスト比較</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">総利息削減額（純粋）</span>
              <span
                className={`font-bold ${
                  results.pureInterestReduction > 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {results.pureInterestReduction >= 0 ? "" : "▲"}
                {formatYen(Math.abs(results.pureInterestReduction))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">借り換え諸費用</span>
              <span className="font-bold text-gray-700">
                {formatYen(results.switchCostYen)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-sm">
              <span className="text-gray-700 font-medium">
                トータルコスト差（諸費用込み）
              </span>
              <span
                className={`font-bold text-base ${
                  results.totalCostDiff > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {results.totalCostDiff >= 0 ? "▼" : "▲"}
                {formatYen(Math.abs(results.totalCostDiff))}
              </span>
            </div>
          </div>

          {/* 回収期間 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-2">諸費用回収期間</h3>
            <div className="text-2xl font-bold text-blue-700">
              {results.recoveryMonths < Infinity
                ? results.recoveryYears < 1
                  ? `約 ${Math.round(results.recoveryMonths)} ヶ月`
                  : `約 ${results.recoveryYears.toFixed(1)} 年`
                : "回収できません"}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              諸費用 {formatYen(results.switchCostYen)} ÷ 月々削減額{" "}
              {formatYen(results.monthlyReduction)}
            </p>
          </div>

          {/* 年別累計節約グラフ */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              年別累計節約額（諸費用込み）
            </h3>
            <div className="flex items-end gap-1 h-28">
              {results.yearlyData.map(({ yr, saving }) => {
                const ratio = Math.abs(saving) / maxAbsSaving;
                const isPositive = saving >= 0;
                return (
                  <div
                    key={yr}
                    className="flex-1 flex flex-col items-center justify-end"
                    title={`${yr}年目: ${saving >= 0 ? "+" : ""}${formatYen(saving)}`}
                  >
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isPositive ? "bg-blue-400" : "bg-red-400"
                      }`}
                      style={{ height: `${ratio * 100}%`, minHeight: 2 }}
                    />
                    {(yr % Math.ceil(results.yearlyData.length / 5) === 0 ||
                      yr === 1) && (
                      <span className="text-xs text-gray-400 mt-0.5">{yr}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span className="text-red-400">損 ▼</span>
              <span className="text-blue-400">▲ 得</span>
            </div>
          </div>
        </div>
      )}

      <AdBanner />
      <RelatedTools currentToolId="home-loan-switch" />

      {/* FAQ */}
      <section className="mt-10 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">よくある質問</h2>
        {[
          {
            q: "住宅ローンの借り換えはどんな時にお得ですか？",
            a: "残債が1,000万円以上、残返済期間が10年以上、金利差が1%以上の場合に借り換えのメリットが大きいとされています。諸費用を上回る利息削減効果があるかシミュレーションが重要です。",
          },
          {
            q: "借り換えにかかる諸費用はいくらですか？",
            a: "新しいローンの事務手数料（融資額の2%程度）、登記費用（抵当権設定・抹消）、印紙代など合計で50〜100万円程度かかることが多いです。",
          },
          {
            q: "変動金利から固定金利への借り換えは得ですか？",
            a: "現在の変動金利が低い場合でも、将来の金利上昇リスクを回避するために固定に切り替える選択肢があります。ただし固定金利は変動より高いため、金利上昇がない場合は割高になります。",
          },
          {
            q: "借り換えを断られることはありますか？",
            a: "収入・勤続年数・健康状態（団信）などによって審査が通らない場合があります。また物件の担保評価が下がっている場合も借り換えが難しいことがあります。",
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-medium text-gray-800 text-sm mb-1">Q. {q}</p>
            <p className="text-sm text-gray-600">A. {a}</p>
          </div>
        ))}
      </section>

      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        ※本シミュレーションは概算値（元利均等返済方式）です。実際の借り換え効果は金融機関・審査状況等により異なります。借り換えの判断は金融機関や専門家にご相談ください。
      </p>
    </div>
  );
}
