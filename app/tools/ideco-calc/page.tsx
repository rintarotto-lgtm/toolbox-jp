"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 職業区分
type JobType =
  | "employee_no_pension"
  | "employee_db"
  | "employee_dc"
  | "civil_servant"
  | "self_employed"
  | "homemaker";

interface JobOption {
  value: JobType;
  label: string;
  maxContribution: number;
}

const JOB_OPTIONS: JobOption[] = [
  { value: "employee_no_pension", label: "会社員（企業年金なし）", maxContribution: 23_000 },
  { value: "employee_db", label: "会社員（企業年金あり・DB）", maxContribution: 12_000 },
  { value: "employee_dc", label: "会社員（企業年金あり・DC）", maxContribution: 20_000 },
  { value: "civil_servant", label: "公務員", maxContribution: 12_000 },
  { value: "self_employed", label: "自営業・フリーランス", maxContribution: 68_000 },
  { value: "homemaker", label: "専業主婦(夫)", maxContribution: 23_000 },
];

// ─── 所得税率（課税所得ベースの簡易推定）
function getIncomeTaxRate(annualIncome: number): number {
  // 給与所得控除・基礎控除・社会保険料控除を簡易に差し引いた課税所得で判断
  if (annualIncome <= 1_950_000) return 0.05;
  if (annualIncome <= 3_300_000) return 0.10;
  if (annualIncome <= 6_950_000) return 0.20;
  if (annualIncome <= 9_000_000) return 0.23;
  if (annualIncome <= 18_000_000) return 0.33;
  if (annualIncome <= 40_000_000) return 0.40;
  return 0.45;
}

// ─── iDeCo計算
function calcIdeco(
  monthlyContribution: number,
  annualIncome: number,
  currentAge: number,
  returnRate: number
) {
  const incomeTaxRate = getIncomeTaxRate(annualIncome);
  const annualContribution = monthlyContribution * 12;

  // 年間節税額 = 掛金 × (所得税率 + 住民税率10%)
  const annualTaxSaving = Math.round(annualContribution * (incomeTaxRate + 0.10));

  const operationYears = 60 - currentAge;
  const principal = annualContribution * operationYears;

  // 60歳時受取額（年金現価の将来価値）
  let payout60: number;
  if (returnRate === 0) {
    payout60 = annualContribution * operationYears;
  } else {
    const r = returnRate / 100;
    payout60 = Math.round(annualContribution * ((Math.pow(1 + r, operationYears) - 1) / r));
  }

  const gain = payout60 - principal;

  return {
    incomeTaxRate,
    annualContribution,
    annualTaxSaving,
    taxSaving10y: annualTaxSaving * 10,
    taxSavingTotal: annualTaxSaving * operationYears,
    operationYears,
    principal,
    payout60: Math.round(payout60),
    gain: Math.round(gain),
  };
}

// ─── 利回り別受取額テーブル
const RATE_TABLE = [0, 3, 5, 7];

// ─── クイック選択掛金ボタン
const QUICK_CONTRIBUTIONS = [5_000, 10_000, 12_000, 20_000, 23_000, 30_000, 50_000, 68_000];

// ─── FAQ
const FAQS = [
  {
    question: "iDeCoで年間いくら節税できますか？",
    answer:
      "iDeCoの節税額は掛金と所得税率によります。年収500万円の会社員が月23,000円掛けた場合、年間約62,100円（所得税＋住民税）の節税になります。",
  },
  {
    question: "iDeCoの掛金上限はいくらですか？",
    answer:
      "掛金上限は職業によって異なります。会社員（企業年金なし）は月23,000円、自営業・フリーランスは月68,000円、公務員は月12,000円、専業主婦(夫)は月23,000円が上限です。",
  },
  {
    question: "iDeCoはいつから始めるべきですか？",
    answer:
      "iDeCoは早く始めるほど複利効果と節税効果が高まります。20〜30代から始めると60歳時の受取額が大きく増えます。ただし60歳まで原則引き出せないため、生活費の余剰資金で始めることをおすすめします。",
  },
];

function formatYen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

function formatMan(n: number): string {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

export default function IdecoCalc() {
  const [jobType, setJobType] = useState<JobType>("employee_no_pension");
  const [income, setIncome] = useState(5_000_000);
  const [age, setAge] = useState(35);
  const [returnRate, setReturnRate] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentJob = JOB_OPTIONS.find((j) => j.value === jobType) ?? JOB_OPTIONS[0];
  const maxContrib = currentJob.maxContribution;

  const [monthlyContrib, setMonthlyContrib] = useState(23_000);

  // Clamp contribution when job type changes
  const clampedContrib = Math.min(monthlyContrib, maxContrib);

  const result = useMemo(
    () => calcIdeco(clampedContrib, income, age, returnRate),
    [clampedContrib, income, age, returnRate]
  );

  const handleJobChange = (newJob: JobType) => {
    setJobType(newJob);
    const newMax = JOB_OPTIONS.find((j) => j.value === newJob)?.maxContribution ?? 23_000;
    setMonthlyContrib((prev) => Math.min(prev, newMax));
  };

  const handleContribChange = (val: number) => {
    setMonthlyContrib(Math.min(val, maxContrib));
  };

  // Bar chart percentages
  const totalHeight = result.payout60 > 0 ? result.payout60 : 1;
  const principalPct = (result.principal / totalHeight) * 100;
  const gainPct = (Math.max(0, result.gain) / totalHeight) * 100;

  // 利回り別テーブル
  const rateTableData = RATE_TABLE.map((r) => ({
    rate: r,
    ...calcIdeco(clampedContrib, income, age, r),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        iDeCo節税シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        掛金・年収・年齢・利回りから年間節税額と60歳時の受取額を計算します。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        {/* 職業区分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">職業区分</label>
          <select
            value={jobType}
            onChange={(e) => handleJobChange(e.target.value as JobType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white"
          >
            {JOB_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}（上限 月{opt.maxContribution.toLocaleString("ja-JP")}円）
              </option>
            ))}
          </select>
        </div>

        {/* 月額掛金スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            月額掛金 — 上限: {maxContrib.toLocaleString("ja-JP")}円/月
          </label>
          <input
            type="range"
            min={1_000}
            max={maxContrib}
            step={1_000}
            value={clampedContrib}
            onChange={(e) => handleContribChange(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-600
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-indigo-200 to-indigo-500"
          />
          <div className="text-center text-3xl font-extrabold text-indigo-700 mt-2">
            月 {clampedContrib.toLocaleString("ja-JP")} 円
          </div>
          {/* クイック選択 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_CONTRIBUTIONS.filter((v) => v <= maxContrib).map((v) => (
              <button
                key={v}
                onClick={() => handleContribChange(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  clampedContrib === v
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                }`}
              >
                {(v / 1_000).toLocaleString()}千円
              </button>
            ))}
          </div>
        </div>

        {/* 年収スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年収（額面）</label>
          <input
            type="range"
            min={1_000_000}
            max={20_000_000}
            step={100_000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-400
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-indigo-100 to-indigo-300"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100万</span>
            <span>500万</span>
            <span>1,000万</span>
            <span>1,500万</span>
            <span>2,000万</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {(income / 10_000).toLocaleString("ja-JP")}万円
            <span className="ml-2 text-xs text-gray-500 font-normal">
              （所得税率 {(result.incomeTaxRate * 100).toFixed(0)}%）
            </span>
          </p>
        </div>

        {/* 現在の年齢スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の年齢 — 運用期間: {result.operationYears}年
          </label>
          <input
            type="range"
            min={20}
            max={59}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-blue-100 to-blue-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>20歳</span>
            <span>30歳</span>
            <span>40歳</span>
            <span>50歳</span>
            <span>59歳</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">{age}歳</p>
        </div>

        {/* 想定利回りスライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">想定利回り</label>
          <input
            type="range"
            min={0}
            max={7}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-teal-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-teal-100 to-teal-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>1%</span>
            <span>3%</span>
            <span>5%</span>
            <span>7%</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            年 {returnRate}%
          </p>
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">年間節税額（所得税＋住民税）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-2">
          {formatYen(result.annualTaxSaving)}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">運用期間</p>
            <p className="text-xl font-bold">{result.operationYears}年</p>
          </div>
          <div>
            <p className="text-xs opacity-75">月額掛金</p>
            <p className="text-xl font-bold">{clampedContrib.toLocaleString("ja-JP")}円</p>
          </div>
          <div>
            <p className="text-xs opacity-75">年収</p>
            <p className="text-xl font-bold">{(income / 10_000).toLocaleString("ja-JP")}万円</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 節税シミュレーション ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">節税シミュレーション</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
            <p className="text-xs text-indigo-600 mb-1">1年間の節税額</p>
            <p className="text-2xl font-bold text-indigo-700">{formatYen(result.annualTaxSaving)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-600 mb-1">10年間の節税額</p>
            <p className="text-2xl font-bold text-blue-700">{formatMan(result.taxSaving10y)}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-xs text-purple-600 mb-1">全期間（{result.operationYears}年）の節税額</p>
            <p className="text-2xl font-bold text-purple-700">{formatMan(result.taxSavingTotal)}</p>
          </div>
        </div>
      </div>

      {/* ─── 60歳時受取シミュレーション（CSS棒グラフ）─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          60歳時 受取シミュレーション（利回り {returnRate}%）
        </h2>
        <div className="flex items-end gap-6 mb-4" style={{ height: 160 }}>
          {/* 元本バー */}
          <div className="flex flex-col items-center flex-1">
            <p className="text-xs text-gray-500 mb-1">元本総額</p>
            <div
              className="w-full bg-indigo-300 rounded-t-lg transition-all duration-500"
              style={{ height: `${Math.max(4, principalPct)}%` }}
            />
            <p className="text-xs font-semibold text-gray-700 mt-1">
              {formatMan(result.principal)}
            </p>
          </div>
          {/* 受取額バー */}
          <div className="flex flex-col items-center flex-1">
            <p className="text-xs text-gray-500 mb-1">60歳時受取額</p>
            <div className="w-full rounded-t-lg overflow-hidden transition-all duration-500" style={{ height: "100%" }}>
              <div
                className="w-full bg-teal-400 transition-all duration-500"
                style={{ height: `${Math.max(0, gainPct)}%` }}
              />
              <div
                className="w-full bg-indigo-300"
                style={{ height: `${principalPct}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-teal-700 mt-1">
              {formatMan(result.payout60)}
            </p>
          </div>
          {/* 運用益バー */}
          <div className="flex flex-col items-center flex-1">
            <p className="text-xs text-gray-500 mb-1">運用益</p>
            <div
              className="w-full bg-teal-400 rounded-t-lg transition-all duration-500"
              style={{ height: `${Math.max(result.gain > 0 ? 4 : 0, gainPct)}%` }}
            />
            <p className="text-xs font-semibold text-teal-700 mt-1">
              {formatMan(Math.max(0, result.gain))}
            </p>
          </div>
        </div>
        {/* 凡例 */}
        <div className="flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-indigo-300" />元本
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-teal-400" />運用益
          </span>
        </div>
      </div>

      {/* ─── 利回り別受取額テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">利回り別 受取額比較</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">利回り</th>
                <th className="text-right py-2 px-2 font-medium">元本</th>
                <th className="text-right py-2 px-2 font-medium">運用益</th>
                <th className="text-right py-2 px-2 font-medium">60歳時受取額</th>
              </tr>
            </thead>
            <tbody>
              {rateTableData.map((row) => (
                <tr
                  key={row.rate}
                  className={`border-b border-gray-100 ${
                    row.rate === returnRate ? "bg-indigo-50 font-bold" : ""
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-800">{row.rate}%</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">
                    {formatMan(row.principal)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-teal-600">
                    +{formatMan(Math.max(0, row.gain))}
                  </td>
                  <td className="py-2.5 px-2 text-right text-indigo-700 font-semibold">
                    {formatMan(row.payout60)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-indigo-600"
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

      <RelatedTools currentToolId="ideco-calc" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の節税額・受取額は掛金の種類、運用実績、受取方法（一時金・年金）、
        退職所得控除・公的年金等控除の適用状況によって異なります。正確な情報は金融機関や税理士にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
