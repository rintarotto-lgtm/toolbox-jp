"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 上限基本月額（2024年度）
const SALARY_CAP = 450_300;

// ─── 取得パターン
type LeavePattern =
  | "mama"
  | "papa_sango"
  | "papa_normal";

interface PatternOption {
  value: LeavePattern;
  label: string;
}

const PATTERN_OPTIONS: PatternOption[] = [
  { value: "mama", label: "ママ（産前6週＋産後8週＋育休）" },
  { value: "papa_sango", label: "パパ（産後8週以内の育休）" },
  { value: "papa_normal", label: "パパ（通常育休）" },
];

// ─── 月収別比較テーブルの定義
const COMPARISON_SALARIES = [200_000, 250_000, 300_000, 350_000, 400_000, 500_000];

// ─── FAQ
const FAQS = [
  {
    question: "育児休業給付金はいくらもらえますか？",
    answer:
      "育休開始から180日（約6ヶ月）は月収の67%、181日目以降は月収の50%が支給されます。上限は基本月額450,300円（2024年度）です。月収30万円なら最初の6ヶ月は月約20.1万円、その後は月約15万円が目安です。",
  },
  {
    question: "育休給付金の計算方法を教えてください。",
    answer:
      "「休業開始時賃金日額 × 支給日数 × 給付率」で計算されます。賃金日額は育休前6ヶ月の賃金総額÷180で決まります。このシミュレーターでは月収（額面）から概算します。上限額は月収換算で450,300円です。",
  },
  {
    question: "育児休業給付金はいつまでもらえますか？",
    answer:
      "原則として子どもが1歳になるまでです。保育所に入れない場合などは最大2歳まで延長申請できます。パパ・ママ育休プラスを利用した場合は最大1歳2ヶ月まで取得可能です。",
  },
  {
    question: "パパ育休（産後パパ育休）はどう違いますか？",
    answer:
      "産後パパ育休は子どもの出生後8週間以内に最大4週間（28日）取得できる制度です。2022年10月から導入され、通常の育休とは別に取得可能です。給付率は28日間が月収の80%相当（手取りベースでほぼ従来収入と同等）になります。",
  },
];

// ─── 計算関数
interface CalcResult {
  cappedSalary: number;
  sankyuAllowance: number; // 産前産後98日分の出産手当金
  monthly67: number;
  monthly50: number;
  months180: number;
  monthsAfter: number;
  ikukyuTotal: number;
  socialInsuranceSaving: number;
  grandTotal: number;
  monthlyAvg: number;
  effectiveRate: number;
}

function calcIkukyu(
  monthlySalary: number,
  ikukyuMonths: number,
  pattern: LeavePattern
): CalcResult {
  const cappedSalary = Math.min(monthlySalary, SALARY_CAP);

  // 産前産後手当（ママのみ）
  const sankyuAllowance =
    pattern === "mama" ? Math.round((monthlySalary / 30) * 98) : 0;

  // 育休給付金
  const months180 = Math.min(6, ikukyuMonths);
  const monthsAfter = Math.max(0, ikukyuMonths - 6);

  // パパ産後育休（28日=約0.93ヶ月）は80%給付で別扱い
  let ikukyuTotal = 0;
  if (pattern === "papa_sango") {
    // 産後パパ育休: 28日間（最大）≒ 最初の約1ヶ月は80%
    const papaMonths = Math.min(ikukyuMonths, 28 / 30);
    ikukyuTotal = Math.round(cappedSalary * 0.8 * papaMonths);
    // 残り期間があれば通常育休67% → 50%
    const remainMonths = Math.max(0, ikukyuMonths - papaMonths);
    const rem180 = Math.min(6, remainMonths);
    const remAfter = Math.max(0, remainMonths - 6);
    ikukyuTotal += Math.round(cappedSalary * 0.67 * rem180 + cappedSalary * 0.5 * remAfter);
  } else {
    const monthly67 = Math.round(cappedSalary * 0.67);
    const monthly50 = Math.round(cappedSalary * 0.5);
    ikukyuTotal = monthly67 * months180 + monthly50 * monthsAfter;
  }

  const monthly67 = Math.round(cappedSalary * 0.67);
  const monthly50 = Math.round(cappedSalary * 0.5);

  // 社会保険料免除（育休中は本人・会社負担ともに免除）
  // 本人負担分: 健保約5.0% + 厚年約9.15% + 介護約0.9% ≒ 14.8%（40歳未満基準）
  const socialInsuranceMonthly = Math.round(monthlySalary * 0.148);
  const socialInsuranceSaving = socialInsuranceMonthly * ikukyuMonths;

  const grandTotal = ikukyuTotal + sankyuAllowance + socialInsuranceSaving;
  const totalMonths = ikukyuMonths + (pattern === "mama" ? 3.267 : 0);
  const monthlyAvg = totalMonths > 0 ? Math.round(ikukyuTotal / ikukyuMonths) : 0;
  const effectiveRate = monthlySalary > 0 ? (monthlyAvg / monthlySalary) * 100 : 0;

  return {
    cappedSalary,
    sankyuAllowance,
    monthly67,
    monthly50,
    months180,
    monthsAfter,
    ikukyuTotal,
    socialInsuranceSaving,
    grandTotal,
    monthlyAvg,
    effectiveRate,
  };
}

// ─── 月別シミュレーション（最大12ヶ月）
interface MonthRow {
  month: number;
  amount: number;
  rate: string;
  label: string;
}

function buildMonthlyTable(
  cappedSalary: number,
  ikukyuMonths: number,
  pattern: LeavePattern
): MonthRow[] {
  const rows: MonthRow[] = [];
  const displayMonths = Math.min(ikukyuMonths, 12);

  for (let m = 1; m <= displayMonths; m++) {
    let amount: number;
    let rate: string;
    let label: string;

    if (pattern === "papa_sango" && m === 1) {
      amount = Math.round(cappedSalary * 0.8 * (28 / 30));
      rate = "80%";
      label = "産後パパ育休（28日）";
    } else if (m <= 6) {
      amount = Math.round(cappedSalary * 0.67);
      rate = "67%";
      label = `育休${m}ヶ月目`;
    } else {
      amount = Math.round(cappedSalary * 0.5);
      rate = "50%";
      label = `育休${m}ヶ月目`;
    }

    rows.push({ month: m, amount, rate, label });
  }
  return rows;
}

// ─── フォーマットヘルパー
function formatMan(n: number): string {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

function formatYen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function IkukyuCalc() {
  const [monthlySalary, setMonthlySalary] = useState(300_000);
  const [ikukyuMonths, setIkukyuMonths] = useState(12);
  const [pattern, setPattern] = useState<LeavePattern>("mama");
  const [incomeReduced, setIncomeReduced] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcIkukyu(monthlySalary, ikukyuMonths, pattern),
    [monthlySalary, ikukyuMonths, pattern]
  );

  const monthlyRows = useMemo(
    () => buildMonthlyTable(result.cappedSalary, ikukyuMonths, pattern),
    [result.cappedSalary, ikukyuMonths, pattern]
  );

  const comparisonData = useMemo(
    () =>
      COMPARISON_SALARIES.map((s) => ({
        salary: s,
        ...calcIkukyu(s, ikukyuMonths, pattern),
      })),
    [ikukyuMonths, pattern]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        育休給付金計算シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        月収・育休期間・取得パターンを入力して育児休業給付金と出産手当金の受給総額を計算します。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        {/* 月収スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            月収（額面）
          </label>
          <input
            type="range"
            min={150_000}
            max={800_000}
            step={10_000}
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-rose-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-rose-200 to-rose-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>15万</span>
            <span>30万</span>
            <span>45万</span>
            <span>60万</span>
            <span>80万</span>
          </div>
          <div className="text-center mt-2">
            <span className="text-3xl font-extrabold text-rose-600">
              月 {(monthlySalary / 10_000).toLocaleString("ja-JP")}万円
            </span>
            {monthlySalary > SALARY_CAP && (
              <p className="text-xs text-amber-600 mt-1">
                ※ 上限額 {(SALARY_CAP / 10_000).toFixed(1)}万円で計算されます
              </p>
            )}
          </div>
        </div>

        {/* 育休取得期間スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            育休取得期間
          </label>
          <input
            type="range"
            min={2}
            max={24}
            step={1}
            value={ikukyuMonths}
            onChange={(e) => setIkukyuMonths(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-pink-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-pink-200 to-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2ヶ月</span>
            <span>6ヶ月</span>
            <span>12ヶ月</span>
            <span>18ヶ月</span>
            <span>24ヶ月</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {ikukyuMonths}ヶ月
          </p>
        </div>

        {/* 取得パターン */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            性別 / 取得パターン
          </label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as LeavePattern)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-white"
          >
            {PATTERN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 復帰後収入トグル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            復帰後の月収変化
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setIncomeReduced(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                !incomeReduced
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-rose-50"
              }`}
            >
              変わらない
            </button>
            <button
              onClick={() => setIncomeReduced(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                incomeReduced
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-rose-50"
              }`}
            >
              時短で収入が減る
            </button>
          </div>
          {incomeReduced && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              時短勤務で月収が減少した場合、次回育休時の給付金算定基準額が下がる可能性があります。育休終了後2年以内の再度の育休では、時短前の賃金を基準に計算される場合があります。
            </p>
          )}
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">育休給付金 合計</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {formatMan(result.ikukyuTotal)}
        </p>
        <p className="text-sm opacity-80 mb-4">
          月平均 {formatYen(result.monthlyAvg)}
          <span className="ml-2 text-xs opacity-70">（月収の約{result.effectiveRate.toFixed(0)}%）</span>
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">月収（額面）</p>
            <p className="text-lg font-bold">
              {(monthlySalary / 10_000).toFixed(0)}万円
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75">育休期間</p>
            <p className="text-lg font-bold">{ikukyuMonths}ヶ月</p>
          </div>
          <div>
            <p className="text-xs opacity-75">実質受給総額※</p>
            <p className="text-lg font-bold">{formatMan(result.grandTotal)}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── タイムライン ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">受給タイムライン</h2>
        <div className="relative pl-8">
          {/* 縦線 */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-rose-200" />

          {/* 産休（ママのみ） */}
          {pattern === "mama" && (
            <div className="relative mb-5">
              <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-rose-400 border-2 border-white shadow" />
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    産前産後休業（98日）
                  </span>
                  <span className="text-sm font-bold text-rose-700">
                    出産手当金
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-rose-700">
                  {formatMan(result.sankyuAllowance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  月収÷30 × 98日（健康保険から支給・非課税）
                </p>
              </div>
            </div>
          )}

          {/* 育休 0〜6ヶ月 */}
          <div className="relative mb-5">
            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow" />
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                  育休0〜6ヶ月（{result.months180}ヶ月適用）
                </span>
                <span className="text-sm font-bold text-pink-700">月収の67%</span>
              </div>
              <p className="text-2xl font-extrabold text-pink-700">
                {formatYen(result.monthly67)} <span className="text-base font-medium">/ 月</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                雇用保険から支給・非課税・社会保険料免除
              </p>
            </div>
          </div>

          {/* 育休 7ヶ月〜 */}
          {result.monthsAfter > 0 && (
            <div className="relative mb-5">
              <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-purple-400 border-2 border-white shadow" />
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                    育休7ヶ月〜（{result.monthsAfter}ヶ月適用）
                  </span>
                  <span className="text-sm font-bold text-purple-700">月収の50%</span>
                </div>
                <p className="text-2xl font-extrabold text-purple-700">
                  {formatYen(result.monthly50)} <span className="text-base font-medium">/ 月</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  雇用保険から支給・非課税・社会保険料免除
                </p>
              </div>
            </div>
          )}

          {/* 社保免除 */}
          <div className="relative">
            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-white shadow" />
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  社会保険料免除（育休全期間）
                </span>
                <span className="text-sm font-bold text-teal-700">節約効果</span>
              </div>
              <p className="text-2xl font-extrabold text-teal-700">
                {formatMan(result.socialInsuranceSaving)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                健保＋厚年の本人負担分（約14.8%）× {ikukyuMonths}ヶ月
              </p>
            </div>
          </div>
        </div>

        {/* 合計サマリ */}
        <div className="mt-5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {pattern === "mama" && (
              <div>
                <p className="text-xs text-rose-500 mb-0.5">出産手当金</p>
                <p className="text-xl font-bold text-rose-700">
                  {formatMan(result.sankyuAllowance)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-pink-500 mb-0.5">育休給付金</p>
              <p className="text-xl font-bold text-pink-700">
                {formatMan(result.ikukyuTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-teal-500 mb-0.5">社保免除（節約）</p>
              <p className="text-xl font-bold text-teal-700">
                {formatMan(result.socialInsuranceSaving)}
              </p>
            </div>
            <div className={pattern === "mama" ? "sm:col-span-3" : "sm:col-span-1"}>
              <p className="text-xs text-gray-500 mb-0.5">実質受給総額</p>
              <p className="text-2xl font-extrabold text-gray-900">
                {formatMan(result.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 月別シミュレーション表 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          月別受給シミュレーション
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          ※ 最大12ヶ月分を表示。上限月額 {SALARY_CAP.toLocaleString("ja-JP")}円で計算。
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">月</th>
                <th className="text-left py-2 px-2 font-medium">内容</th>
                <th className="text-right py-2 px-2 font-medium">給付率</th>
                <th className="text-right py-2 px-2 font-medium">受給額</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map((row) => (
                <tr
                  key={row.month}
                  className={`border-b border-gray-100 ${
                    row.rate === "67%" || row.rate === "80%"
                      ? "bg-pink-50"
                      : "bg-purple-50"
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-700 font-medium">
                    {row.month}ヶ月目
                  </td>
                  <td className="py-2.5 px-2 text-gray-600 text-xs">{row.label}</td>
                  <td className="py-2.5 px-2 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.rate === "80%"
                          ? "bg-rose-100 text-rose-700"
                          : row.rate === "67%"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {row.rate}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold text-gray-800">
                    {formatYen(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      {/* ─── 月収別比較テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">月収別 受給額比較</h2>
        <p className="text-xs text-gray-500 mb-4">
          育休 {ikukyuMonths}ヶ月 / {PATTERN_OPTIONS.find((p) => p.value === pattern)?.label}
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">月収（額面）</th>
                <th className="text-right py-2 px-2 font-medium">育休給付金</th>
                <th className="text-right py-2 px-2 font-medium">社保免除</th>
                <th className="text-right py-2 px-2 font-medium">実質総額</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr
                  key={row.salary}
                  className={`border-b border-gray-100 ${
                    row.salary === monthlySalary
                      ? "bg-rose-50 font-bold"
                      : ""
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-800">
                    {(row.salary / 10_000).toFixed(0)}万円
                    {row.salary === monthlySalary && (
                      <span className="ml-1.5 text-xs bg-rose-200 text-rose-700 px-1.5 py-0.5 rounded-full">
                        現在
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-pink-700">
                    {formatMan(row.ikukyuTotal)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-teal-600">
                    {formatMan(row.socialInsuranceSaving)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-rose-700 font-semibold">
                    {formatMan(row.grandTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 注意事項 ─── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-bold text-amber-800 mb-3">ご利用にあたっての注意事項</h2>
        <ul className="space-y-2 text-xs text-amber-900 leading-relaxed list-disc list-inside">
          <li>
            <strong>受給資格:</strong> 雇用保険への加入期間が育休前の2年間に11日以上就業した月が12ヶ月以上あることが条件です。
          </li>
          <li>
            <strong>育休給付金は非課税:</strong> 所得税・住民税はかかりません。また育休中は社会保険料（健保・厚年）の本人・会社負担ともに免除されます。
          </li>
          <li>
            <strong>上限額:</strong> 基本月額の上限は450,300円（2024年度）。月収がこれを超える場合は上限額で計算されます。
          </li>
          <li>
            <strong>出産手当金:</strong> 健康保険加入者（被保険者本人）が対象。被扶養者は対象外です。
          </li>
          <li>
            <strong>産後パパ育休（出生時育児休業）:</strong> 子の出生後8週間以内に最大4週間（28日）取得可。通常育休と分割して最大2回取得可能です。
          </li>
          <li>
            <strong>延長:</strong> 保育所未入所等の場合、1歳6ヶ月・2歳まで延長可。ハローワークへの申請が必要です。
          </li>
          <li>
            このシミュレーターは概算です。実際の受給額は算定基準額・支給日数等によって異なります。正確な情報はハローワークや会社の担当部署にご確認ください。
          </li>
        </ul>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-rose-600 transition-colors"
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

      <RelatedTools currentToolId="ikukyu-calc" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の育児休業給付金・出産手当金は算定基準額・支給日数・勤務形態によって異なります。
        社会保険料免除額は健康保険料率・介護保険料（40歳以上）・厚生年金保険料率によって変わります。
        正確な受給額はハローワーク・勤務先の人事担当・社会保険労務士にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
