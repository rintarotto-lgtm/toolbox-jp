"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── Types ───
type Mode = "lump" | "monthly";
type Frequency = 1 | 4 | 12;

interface YearRow {
  year: number;
  principal: number;
  value: number;
  gain: number;
}

// ─── Helpers ───
function calcCompound(
  initialAmount: number,
  monthlyAmount: number,
  annualRate: number,
  years: number,
  frequency: Frequency,
  mode: Mode
): YearRow[] {
  const rows: YearRow[] = [];
  const r = annualRate / 100 / frequency; // rate per period
  const periodsPerYear = frequency;

  let value = initialAmount;

  for (let yr = 1; yr <= years; yr++) {
    // Simulate this year period by period
    for (let p = 0; p < periodsPerYear; p++) {
      value = value * (1 + r);
      if (mode === "monthly") {
        // Add monthly contributions per period
        const monthsInPeriod = 12 / periodsPerYear;
        value += monthlyAmount * monthsInPeriod;
      }
    }

    const principal =
      mode === "lump"
        ? initialAmount
        : initialAmount + monthlyAmount * 12 * yr;

    rows.push({
      year: yr,
      principal,
      value: Math.round(value),
      gain: Math.round(value - principal),
    });
  }

  return rows;
}

function formatMan(n: number): string {
  const man = n / 10_000;
  if (man >= 10000) return `${(man / 10000).toFixed(2)}億円`;
  if (man >= 100) return `${Math.round(man).toLocaleString("ja-JP")}万円`;
  return `${man.toFixed(1)}万円`;
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

// ─── FAQ data ───
const FAQS = [
  {
    q: "複利と単利の違いは何ですか？",
    a: "単利は元本だけに利息がつきますが、複利は元本に加えて過去の利息にも利息がつきます。100万円を年利5%で10年運用した場合、単利なら150万円ですが複利なら約163万円になります。長期運用ほど差は大きくなります。",
  },
  {
    q: "72の法則とは何ですか？",
    a: "「72 ÷ 年利(%) ≈ 資産が2倍になる年数」を求める近似式です。年利6%なら72÷6=12年で約2倍になります。複利運用の効果を直感的に把握するために広く使われています。",
  },
  {
    q: "毎月いくら積み立てれば老後に備えられますか？",
    a: "年利5%・20年積立の場合、毎月約5万円で2,000万円を目指せます。必要額は生活水準によって異なりますが、まずは毎月の余剰資金の範囲で無理なく始めることが重要です。",
  },
  {
    q: "インフレが資産運用に与える影響は？",
    a: "年2%のインフレが続くと、30年後には現在の100万円の価値が約55万円に目減りします。インフレ率を上回る利回りで資産を運用することが、実質的な資産保全・増加につながります。",
  },
];

// ─── Component ───
export default function CompoundInterest() {
  const [mode, setMode] = useState<Mode>("lump");
  const [initialAmount, setInitialAmount] = useState(100); // 万円
  const [monthlyAmount, setMonthlyAmount] = useState(3); // 万円
  const [annualRate, setAnnualRate] = useState(5); // %
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState<Frequency>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rows = useMemo(
    () =>
      calcCompound(
        initialAmount * 10_000,
        monthlyAmount * 10_000,
        annualRate,
        years,
        frequency,
        mode
      ),
    [initialAmount, monthlyAmount, annualRate, years, frequency, mode]
  );

  const finalRow = rows[rows.length - 1] ?? { year: 0, principal: 0, value: 0, gain: 0 };
  const gainRate =
    finalRow.principal > 0
      ? ((finalRow.gain / finalRow.principal) * 100).toFixed(1)
      : "0.0";

  // 72の法則
  const rule72 = annualRate > 0 ? (72 / annualRate).toFixed(1) : "∞";

  // CSS bar chart: find max value for scaling
  const maxValue = Math.max(...rows.map((r) => r.value), 1);

  // Display up to 20 rows in table (or every Nth year if years > 20)
  const tableRows = rows.filter((r) => {
    if (years <= 20) return true;
    const step = Math.ceil(years / 20);
    return r.year % step === 0 || r.year === years;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📈</span>
          <h1 className="text-2xl font-bold">複利計算シミュレーター</h1>
        </div>
        <p className="text-blue-100 text-sm">
          一括投資・毎月積立の両方に対応。元本・年利・期間から将来の資産額をグラフで確認。
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["lump", "monthly"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-white text-blue-700 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "lump" ? "一括投資" : "毎月積立"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* 初期投資額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            初期投資額
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100000}
              step={1}
              value={initialAmount}
              onChange={(e) => setInitialAmount(Math.max(0, Number(e.target.value)))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500 text-sm shrink-0">万円</span>
          </div>
        </div>

        {/* 毎月積立額 (積立モードのみ) */}
        {mode === "monthly" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              毎月積立額
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={1000}
                step={0.1}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-500 text-sm shrink-0">万円/月</span>
            </div>
          </div>
        )}

        {/* 年利 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年利: <span className="text-blue-700 font-bold">{annualRate}%</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={20}
            step={0.1}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-600
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-blue-200 to-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.1%</span>
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
            <span>20%</span>
          </div>
        </div>

        {/* 運用期間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            運用期間: <span className="text-blue-700 font-bold">{years}年</span>
          </label>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-600
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-indigo-200 to-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1年</span>
            <span>10年</span>
            <span>20年</span>
            <span>30年</span>
            <span>50年</span>
          </div>
        </div>

        {/* 複利計算頻度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            複利計算頻度
          </label>
          <div className="flex gap-2">
            {([1, 4, 12] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  frequency === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {f === 1 ? "年1回" : f === 4 ? "年4回" : "年12回"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">最終資産額</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">
              {formatMan(finalRow.value)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">元本合計</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-700">
              {formatMan(finalRow.principal)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
          <div className="text-center">
            <p className="text-xs text-indigo-600 mb-1">運用益</p>
            <p className="text-xl font-bold text-indigo-700">
              +{formatMan(finalRow.gain)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-indigo-600 mb-1">運用益率</p>
            <p className="text-xl font-bold text-indigo-700">+{gainRate}%</p>
          </div>
        </div>
      </div>

      {/* 72の法則 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-bold text-amber-800 mb-1">72の法則</p>
          <p className="text-sm text-amber-700">
            年利 <strong>{annualRate}%</strong> で運用すると、資産が2倍になるのはおよそ{" "}
            <strong className="text-amber-900 text-base">{rule72}年後</strong> です。
            <br />
            <span className="text-xs text-amber-600">（72 ÷ {annualRate} = {rule72}）</span>
          </p>
        </div>
      </div>

      <AdBanner />

      {/* CSS Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">資産成長グラフ</h2>
        <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 400 }}>
          {rows.map((row) => {
            const principalPct = (row.principal / maxValue) * 100;
            const gainPct = (Math.max(0, row.gain) / maxValue) * 100;
            return (
              <div key={row.year} className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500 w-8 shrink-0 text-right">
                  {row.year}年
                </span>
                <div className="flex flex-1 h-5 rounded overflow-hidden bg-gray-100">
                  <div
                    className="bg-blue-400 transition-all duration-300"
                    style={{ width: `${principalPct}%` }}
                  />
                  <div
                    className="bg-indigo-500 transition-all duration-300"
                    style={{ width: `${gainPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-indigo-700 w-24 shrink-0 text-right">
                  {formatMan(row.value)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-blue-400" />元本
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-indigo-500" />運用益
          </span>
        </div>
      </div>

      {/* Year-by-year table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">年別シミュレーション</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-right py-2 px-2 font-medium">年</th>
                <th className="text-right py-2 px-2 font-medium">元本累計</th>
                <th className="text-right py-2 px-2 font-medium">評価額</th>
                <th className="text-right py-2 px-2 font-medium">運用益</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.year}
                  className={`border-b border-gray-100 ${
                    row.year === years ? "bg-blue-50 font-bold" : ""
                  }`}
                >
                  <td className="py-2 px-2 text-right text-gray-600">{row.year}年</td>
                  <td className="py-2 px-2 text-right text-gray-700">
                    {formatMan(row.principal)}
                  </td>
                  <td className="py-2 px-2 text-right text-blue-700 font-semibold">
                    {formatMan(row.value)}
                  </td>
                  <td className="py-2 px-2 text-right text-indigo-600">
                    +{formatMan(row.gain)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-blue-600"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="compound-interest" />

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ 本ツールの計算結果は概算です。正確な金額は税理士・ファイナンシャルプランナーにご相談ください。
        実際の運用では元本割れリスクや手数料・税金が発生します。投資は自己責任でお願いします。
      </p>
    </div>
  );
}
