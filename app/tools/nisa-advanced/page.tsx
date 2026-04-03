"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 定数
const TAX_RATE = 0.20315;
const LIFETIME_LIMIT = 18_000_000; // 1,800万円
const TSUMITATE_ANNUAL = 1_200_000; // 120万円
const SEICHOU_ANNUAL = 2_400_000; // 240万円

// ─── 計算ロジック（複利）
function calcFV(monthly: number, years: number, rate: number): number {
  const mr = rate / 100 / 12;
  const n = years * 12;
  if (mr === 0) return monthly * n;
  return monthly * ((Math.pow(1 + mr, n) - 1) / mr);
}

function calcYearlyData(monthly: number, years: number, rate: number, initialBalance: number) {
  return Array.from({ length: years + 1 }, (_, y) => {
    const fv = calcFV(monthly, y, rate) + initialBalance * Math.pow(1 + rate / 100, y);
    const principal = monthly * y * 12 + initialBalance;
    return { year: y, total: Math.round(fv), principal: Math.round(Math.min(principal, fv)) };
  });
}

// 逆算：目標金額から必要月積立額
function calcRequiredMonthly(target: number, years: number, rate: number): number {
  const mr = rate / 100 / 12;
  const n = years * 12;
  if (mr === 0) return n > 0 ? target / n : 0;
  return target / ((Math.pow(1 + mr, n) - 1) / mr);
}

// ─── FAQ
const FAQS = [
  {
    question: "新NISAの年間投資上限はいくらですか？",
    answer:
      "新NISAはつみたて投資枠120万円＋成長投資枠240万円の年間360万円、生涯投資枠1,800万円（うち成長投資枠1,200万）が上限です。",
  },
  {
    question: "新NISAで1,800万円を満額使うには何年かかりますか？",
    answer:
      "年間360万円（月30万円）を投資すれば最短5年で満額になります。月10万円なら15年です。",
  },
  {
    question: "NISAとiDeCoはどちらを優先すべきですか？",
    answer:
      "iDeCoは掛金が全額所得控除になるため節税効果が高いですが、60歳まで引き出せません。NISAはいつでも売却可能。まずiDeCoで節税し、余裕資金をNISAに回すのが一般的な戦略です。",
  },
  {
    question: "NISAで投資できる商品は何ですか？",
    answer:
      "つみたて投資枠は金融庁が認定した長期・積立・分散投資に適した投資信託・ETF（約300本）。成長投資枠は上場株式・投資信託など幅広い商品が対象です。",
  },
];

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}
function fmtMan(n: number) {
  return `${Math.round(n / 10_000).toLocaleString("ja-JP")}万円`;
}

export default function NisaAdvanced() {
  const [mode, setMode] = useState<"simulation" | "reverse" | "compare">("simulation");

  // ─ 積立シミュレーション
  const [tsumitateMonthly, setTsumitateMonthly] = useState(50000);
  const [seichouMonthly, setSeichouMonthly] = useState(100000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);
  const [currentBalance, setCurrentBalance] = useState(0);

  // ─ 目標逆算
  const [targetAmount, setTargetAmount] = useState(3000);
  const [targetYears, setTargetYears] = useState(20);
  const [targetRate, setTargetRate] = useState(5);

  // ─ FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ─── シミュレーション計算
  const sim = useMemo(() => {
    const monthly = tsumitateMonthly + seichouMonthly;
    const fv = calcFV(monthly, years, rate) + currentBalance * Math.pow(1 + rate / 100, years);
    const principal = monthly * years * 12 + currentBalance;
    const profit = fv - principal;
    const taxSavings = Math.max(0, profit) * TAX_RATE;
    const taxableTotal = principal + Math.max(0, profit) * (1 - TAX_RATE);

    // 生涯枠消化
    const annualInvestment = (tsumitateMonthly + seichouMonthly) * 12;
    const yearsToFull = annualInvestment > 0 ? Math.ceil(LIFETIME_LIMIT / annualInvestment) : 999;
    const lifetimeUsed = Math.min(annualInvestment * years + currentBalance, LIFETIME_LIMIT);
    const lifetimePct = (lifetimeUsed / LIFETIME_LIMIT) * 100;

    // 枠チェック
    const tsumitatePct = Math.min(tsumitateMonthly * 12, TSUMITATE_ANNUAL);
    const seichouPct = Math.min(seichouMonthly * 12, SEICHOU_ANNUAL);

    const yearlyData = calcYearlyData(monthly, years, rate, currentBalance);
    const chartData = yearlyData.filter((d) => d.year % 5 === 0 && d.year > 0);
    const maxFv = Math.max(...chartData.map((d) => d.total), 1);

    return {
      fv: Math.round(fv),
      principal: Math.round(principal),
      profit: Math.round(profit),
      taxSavings: Math.round(taxSavings),
      taxableTotal: Math.round(taxableTotal),
      annualInvestment,
      yearsToFull,
      lifetimeUsed: Math.round(lifetimeUsed),
      lifetimePct,
      tsumitateExceeds: tsumitateMonthly * 12 > TSUMITATE_ANNUAL,
      seichouExceeds: seichouMonthly * 12 > SEICHOU_ANNUAL,
      chartData,
      maxFv,
    };
  }, [tsumitateMonthly, seichouMonthly, rate, years, currentBalance]);

  // ─── 逆算計算
  const reverse = useMemo(() => {
    const monthly = calcRequiredMonthly(targetAmount * 10_000, targetYears, targetRate);
    const tsumitateShare = Math.min(monthly, TSUMITATE_ANNUAL / 12);
    const seichouShare = Math.max(0, monthly - tsumitateShare);
    return {
      monthly: Math.round(monthly),
      tsumitateShare: Math.round(tsumitateShare),
      seichouShare: Math.round(seichouShare),
      annual: Math.round(monthly * 12),
      principal: Math.round(monthly * targetYears * 12),
      profit: Math.round(targetAmount * 10_000 - monthly * targetYears * 12),
    };
  }, [targetAmount, targetYears, targetRate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📊</span>
          <h1 className="text-2xl font-bold">NISAつみたてシミュレーター</h1>
        </div>
        <p className="text-sm opacity-85">
          新NISA（つみたて投資枠・成長投資枠）の積立シミュレーション。課税口座との比較・目標逆算対応。
        </p>
      </div>

      <AdBanner />

      {/* ─── モード切替タブ */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["simulation", "reverse", "compare"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === m
                ? "bg-white text-sky-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "simulation" ? "積立シミュレーション" : m === "reverse" ? "目標逆算" : "非課税メリット比較"}
          </button>
        ))}
      </div>

      {/* ─── 積立シミュレーションモード */}
      {mode === "simulation" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            {/* つみたて投資枠 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  つみたて投資枠（月額）
                </label>
                <span className="text-xs text-sky-600 font-medium">上限 10万円/月</span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={5000}
                value={tsumitateMonthly}
                onChange={(e) => setTsumitateMonthly(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-sky-500
                  [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
                  [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                  bg-gradient-to-r from-sky-100 to-sky-400"
              />
              <p className="text-center text-xl font-bold text-sky-700 mt-1">
                月 {fmt(tsumitateMonthly)}円
              </p>
              {sim.tsumitateExceeds && (
                <p className="text-xs text-amber-600 mt-1 text-center">
                  ⚠️ つみたて投資枠の年間上限（120万円）を超えています
                </p>
              )}
            </div>

            {/* 成長投資枠 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">
                  成長投資枠（月額）
                </label>
                <span className="text-xs text-blue-600 font-medium">上限 20万円/月</span>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={10000}
                value={seichouMonthly}
                onChange={(e) => setSeichouMonthly(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500
                  [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
                  [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                  bg-gradient-to-r from-blue-100 to-blue-400"
              />
              <p className="text-center text-xl font-bold text-blue-700 mt-1">
                月 {fmt(seichouMonthly)}円
              </p>
              {sim.seichouExceeds && (
                <p className="text-xs text-amber-600 mt-1 text-center">
                  ⚠️ 成長投資枠の年間上限（240万円）を超えています
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 利回り */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  想定利回り（年率）― {rate}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-sky-500
                    bg-gradient-to-r from-sky-100 to-sky-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1%</span>
                  <span>5%</span>
                  <span>10%</span>
                </div>
              </div>
              {/* 積立期間 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  積立期間 ― {years}年
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500
                    bg-gradient-to-r from-blue-100 to-blue-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1年</span>
                  <span>15年</span>
                  <span>30年</span>
                </div>
              </div>
            </div>

            {/* 現在のNISA残高 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                現在のNISA残高（万円）
              </label>
              <input
                type="number"
                min={0}
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value) * 10_000)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* 生涯投資枠プログレス */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">生涯投資枠の進捗</span>
              <span className="text-sm font-bold text-sky-700">
                {fmtMan(sim.lifetimeUsed)} / 1,800万円
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(sim.lifetimePct, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              年間{fmtMan(sim.annualInvestment)}の投資で
              {sim.yearsToFull <= 30 ? `約${sim.yearsToFull}年で満額` : "30年超で満額"}
              になります
            </p>
          </div>

          {/* メイン結果 */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <p className="text-sm opacity-85 mb-1">{years}年後の最終資産額（NISA非課税）</p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">{fmtMan(sim.fv)}</p>
            <p className="text-sm opacity-75 mb-4">{fmt(sim.fv)}円</p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">元本合計</p>
                <p className="text-lg font-bold">{fmtMan(sim.principal)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">運用益</p>
                <p className="text-lg font-bold text-yellow-300">+{fmtMan(sim.profit)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">非課税メリット</p>
                <p className="text-lg font-bold text-green-300">+{fmtMan(sim.taxSavings)}</p>
              </div>
            </div>
          </div>

          {/* 棒グラフ */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              年度別 資産推移（利回り {rate}%）
            </h2>
            <div className="flex items-end gap-2" style={{ height: 180 }}>
              {sim.chartData.map((d) => {
                const principalPct = (d.principal / sim.maxFv) * 100;
                const gainAmt = Math.max(0, d.total - d.principal);
                const gainPct = (gainAmt / sim.maxFv) * 100;
                return (
                  <div
                    key={d.year}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <p className="text-xs text-sky-700 font-semibold mb-0.5">
                      {fmtMan(d.total)}
                    </p>
                    <div className="w-full flex flex-col justify-end" style={{ height: "80%" }}>
                      <div
                        className="w-full bg-sky-500 rounded-t transition-all duration-500"
                        style={{ height: `${gainPct}%` }}
                      />
                      <div
                        className="w-full bg-gray-300"
                        style={{ height: `${principalPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{d.year}年</p>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 text-xs text-gray-600 mt-3">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-gray-300" />積立元本
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-sky-500" />運用益
              </span>
            </div>
          </div>
        </>
      )}

      {/* ─── 目標逆算モード */}
      {mode === "reverse" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標金額（万円）
              </label>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-sky-500
                  bg-gradient-to-r from-sky-100 to-sky-400
                  [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100万</span>
                <span>1,000万</span>
                <span>3,000万</span>
                <span>1億</span>
              </div>
              <div className="text-center text-3xl font-extrabold text-sky-700 mt-2">
                {fmt(targetAmount)}万円
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目標年数 ― {targetYears}年
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={targetYears}
                  onChange={(e) => setTargetYears(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500
                    bg-gradient-to-r from-blue-100 to-blue-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1年</span>
                  <span>30年</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  想定利回り ― {targetRate}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={targetRate}
                  onChange={(e) => setTargetRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-sky-500
                    bg-gradient-to-r from-sky-100 to-sky-400"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 逆算結果 */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <p className="text-sm opacity-85 mb-1">必要な月積立額</p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {fmt(reverse.monthly)}円/月
            </p>
            <p className="text-sm opacity-75 mb-4">年間: {fmtMan(reverse.annual)}</p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">目標金額</p>
                <p className="text-lg font-bold">{fmt(targetAmount)}万円</p>
              </div>
              <div>
                <p className="text-xs opacity-75">元本合計</p>
                <p className="text-lg font-bold text-yellow-300">{fmtMan(reverse.principal)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">運用益</p>
                <p className="text-lg font-bold text-green-300">+{fmtMan(Math.max(0, reverse.profit))}</p>
              </div>
            </div>
          </div>

          {/* 枠の使い方 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">NISA枠の使い方（推奨）</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-sky-700">つみたて投資枠</p>
                  <p className="text-xs text-gray-500">月 {fmt(reverse.tsumitateShare)}円 ／ 年 {fmtMan(reverse.tsumitateShare * 12)}</p>
                </div>
                <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">
                  上限 10万/月
                </span>
              </div>
              {reverse.seichouShare > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">成長投資枠</p>
                    <p className="text-xs text-gray-500">月 {fmt(reverse.seichouShare)}円 ／ 年 {fmtMan(reverse.seichouShare * 12)}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    上限 20万/月
                  </span>
                </div>
              )}
            </div>
            {reverse.monthly > 300000 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                ⚠️ 必要月積立額が新NISAの年間上限（月30万円）を超えています。目標年数を延ばすか利回りを見直してください。
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── 非課税メリット比較モード */}
      {mode === "compare" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                月額積立（つみたて＋成長枠合計）
              </label>
              <input
                type="range"
                min={10000}
                max={300000}
                step={10000}
                value={tsumitateMonthly + seichouMonthly}
                onChange={(e) => {
                  const total = Number(e.target.value);
                  const t = Math.min(total, 100000);
                  setTsumitateMonthly(t);
                  setSeichouMonthly(Math.max(0, total - t));
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-sky-500
                  bg-gradient-to-r from-sky-100 to-sky-400
                  [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
              />
              <div className="text-center text-3xl font-extrabold text-sky-700 mt-2">
                月 {fmt(tsumitateMonthly + seichouMonthly)}円
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  利回り ― {rate}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-sky-500
                    bg-gradient-to-r from-sky-100 to-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  積立期間 ― {years}年
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500
                    bg-gradient-to-r from-blue-100 to-blue-400"
                />
              </div>
            </div>
          </div>

          {/* 比較カード */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-sky-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">NISA</span>
                <span className="text-xs text-sky-600 font-medium">非課税</span>
              </div>
              <p className="text-2xl font-bold text-sky-700 mb-2">{fmtMan(sim.fv)}</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>元本</span>
                  <span>{fmtMan(sim.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>運用益</span>
                  <span className="text-sky-600 font-semibold">+{fmtMan(sim.profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>税金</span>
                  <span className="text-green-600 font-semibold">¥0（非課税）</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">課税口座</span>
                <span className="text-xs text-gray-500 font-medium">20.315%課税</span>
              </div>
              <p className="text-2xl font-bold text-gray-700 mb-2">{fmtMan(sim.taxableTotal)}</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>元本</span>
                  <span>{fmtMan(sim.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>運用益（税引後）</span>
                  <span>+{fmtMan(sim.taxableTotal - sim.principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>税金</span>
                  <span className="text-red-500 font-semibold">−{fmtMan(sim.taxSavings)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-center">
            <p className="text-xs text-green-600 mb-1">NISAによる非課税メリット</p>
            <p className="text-3xl font-extrabold text-green-700">+{fmtMan(sim.taxSavings)}</p>
            <p className="text-xs text-gray-500 mt-1">
              課税口座と比べて{fmtMan(sim.taxSavings)}多く手元に残ります
            </p>
          </div>
        </>
      )}

      <AdBanner />

      {/* ─── FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-sky-600 transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="nisa-advanced" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の運用成果は市場環境によって異なり、元本割れのリスクがあります。
        NISA制度の詳細・最新情報は金融庁または金融機関にご確認ください。
        入力情報はサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
