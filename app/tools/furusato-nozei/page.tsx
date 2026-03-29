"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── Lookup table: 独身/共働き（扶養なし）の上限額（自己負担2,000円除く）
const INCOME_TABLE: [number, number][] = [
  [3_000_000, 28_000],
  [4_000_000, 42_000],
  [5_000_000, 61_000],
  [6_000_000, 77_000],
  [7_000_000, 108_000],
  [8_000_000, 129_000],
  [9_000_000, 151_000],
  [10_000_000, 176_000],
  [15_000_000, 395_000],
  [20_000_000, 569_000],
];

// ─── 家族構成の種別
type FamilyType =
  | "single"
  | "couple_child1"
  | "couple_child2"
  | "couple_child3"
  | "spouse"
  | "spouse_child1"
  | "spouse_child2";

interface FamilyOption {
  value: FamilyType;
  label: string;
  multiplier: number;
}

const FAMILY_OPTIONS: FamilyOption[] = [
  { value: "single", label: "独身・共働き（扶養なし）", multiplier: 1.0 },
  { value: "couple_child1", label: "共働き＋子1人（高校生以下）", multiplier: 0.92 },
  { value: "couple_child2", label: "共働き＋子2人", multiplier: 0.84 },
  { value: "couple_child3", label: "共働き＋子3人", multiplier: 0.76 },
  { value: "spouse", label: "専業主婦(夫)（扶養なし）", multiplier: 0.87 },
  { value: "spouse_child1", label: "専業主婦(夫)＋子1人", multiplier: 0.79 },
  { value: "spouse_child2", label: "専業主婦(夫)＋子2人", multiplier: 0.71 },
];

// ─── テーブルから上限額を補間計算（独身基準）
function interpolateLimit(income: number): number {
  if (income < INCOME_TABLE[0][0]) {
    // 300万未満：比例縮小
    return Math.round((income / INCOME_TABLE[0][0]) * INCOME_TABLE[0][1]);
  }
  if (income >= INCOME_TABLE[INCOME_TABLE.length - 1][0]) {
    return INCOME_TABLE[INCOME_TABLE.length - 1][1];
  }
  for (let i = 0; i < INCOME_TABLE.length - 1; i++) {
    const [x0, y0] = INCOME_TABLE[i];
    const [x1, y1] = INCOME_TABLE[i + 1];
    if (income >= x0 && income <= x1) {
      const ratio = (income - x0) / (x1 - x0);
      return Math.round(y0 + ratio * (y1 - y0));
    }
  }
  return 0;
}

function calcFurusatoLimit(income: number, familyType: FamilyType): number {
  const baseLimit = interpolateLimit(income);
  const multiplier = FAMILY_OPTIONS.find((f) => f.value === familyType)?.multiplier ?? 1.0;
  return Math.round(baseLimit * multiplier);
}

// ─── クイック選択年収ボタン
const QUICK_INCOMES = [
  { label: "300万", value: 3_000_000 },
  { label: "400万", value: 4_000_000 },
  { label: "500万", value: 5_000_000 },
  { label: "600万", value: 6_000_000 },
  { label: "700万", value: 7_000_000 },
  { label: "800万", value: 8_000_000 },
  { label: "1000万", value: 10_000_000 },
];

// ─── 年収別目安テーブル（独身）
const TABLE_INCOMES = [
  { label: "300万円", income: 3_000_000 },
  { label: "400万円", income: 4_000_000 },
  { label: "500万円", income: 5_000_000 },
  { label: "600万円", income: 6_000_000 },
  { label: "700万円", income: 7_000_000 },
  { label: "800万円", income: 8_000_000 },
  { label: "1,000万円", income: 10_000_000 },
  { label: "1,500万円", income: 15_000_000 },
  { label: "2,000万円", income: 20_000_000 },
];

// ─── FAQ
const FAQS = [
  {
    question: "ふるさと納税はいくらまでできますか？",
    answer:
      "ふるさと納税の上限額は年収と家族構成によって異なります。年収400万円・独身の場合は約42,000円、年収600万円では約77,000円が目安です。自己負担2,000円を引いた全額が翌年の住民税から控除されます。",
  },
  {
    question: "ふるさと納税の仕組みを教えてください",
    answer:
      "ふるさと納税は自治体への寄附金のうち、2,000円を超える部分が所得税の還付と翌年の住民税から控除される制度です。返礼品として寄附額の最大3割相当の特産品等を受け取ることができます。",
  },
  {
    question: "ワンストップ特例とは？",
    answer:
      "ワンストップ特例制度を利用すると確定申告不要でふるさと納税の控除が受けられます。寄附先が5自治体以内で、確定申告が不要な給与所得者が対象です。",
  },
];

export default function FurusatoNozei() {
  const [income, setIncome] = useState(5_000_000);
  const [familyType, setFamilyType] = useState<FamilyType>("single");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const limit = calcFurusatoLimit(income, familyType);
    const giftValue = Math.round(limit * 0.3);
    const monthly = Math.round(limit / 12);
    return { limit, giftValue, monthly };
  }, [income, familyType]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        ふるさと納税シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        年収と家族構成を選ぶだけで、ふるさと納税の上限額（自己負担2,000円除く）を計算します。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        {/* 年収スライダー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年収（額面）
          </label>
          <input
            type="range"
            min={1_000_000}
            max={20_000_000}
            step={100_000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-orange-200 to-orange-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1 mb-3">
            <span>100万</span>
            <span>500万</span>
            <span>1,000万</span>
            <span>1,500万</span>
            <span>2,000万</span>
          </div>
          <div className="text-center text-3xl font-extrabold text-orange-600">
            {(income / 10_000).toLocaleString("ja-JP")}万円
          </div>
        </div>

        {/* クイック選択ボタン */}
        <div>
          <p className="text-xs text-gray-500 mb-2">クイック選択</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_INCOMES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setIncome(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  income === value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 家族構成 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            家族構成
          </label>
          <select
            value={familyType}
            onChange={(e) => setFamilyType(e.target.value as FamilyType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white"
          >
            {FAMILY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">ふるさと納税 上限額（自己負担2,000円除く）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          ¥{result.limit.toLocaleString("ja-JP")}
        </p>
        <p className="text-sm opacity-80 mb-4">
          年収 {(income / 10_000).toLocaleString("ja-JP")}万円 / {FAMILY_OPTIONS.find((f) => f.value === familyType)?.label}
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
          <div>
            <p className="text-xs opacity-75">返礼品価値目安（上限の30%）</p>
            <p className="text-2xl font-bold">¥{result.giftValue.toLocaleString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">月換算（÷12）</p>
            <p className="text-2xl font-bold">¥{result.monthly.toLocaleString("ja-JP")}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 年収別目安テーブル（独身）─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">年収別の目安上限額（独身の場合）</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">年収</th>
                <th className="text-right py-2 px-2 font-medium">上限額（自己負担除く）</th>
                <th className="text-right py-2 px-2 font-medium">返礼品目安</th>
                <th className="text-right py-2 px-2 font-medium">月換算</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_INCOMES.map(({ label, income: inc }) => {
                const lim = calcFurusatoLimit(inc, "single");
                const isActive = inc === income;
                return (
                  <tr
                    key={inc}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      isActive ? "bg-orange-50 font-bold" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setIncome(inc)}
                  >
                    <td className="py-2.5 px-2 text-gray-800">{label}</td>
                    <td className="py-2.5 px-2 text-right text-orange-600 font-semibold">
                      ¥{lim.toLocaleString("ja-JP")}
                    </td>
                    <td className="py-2.5 px-2 text-right text-yellow-700">
                      ¥{Math.round(lim * 0.3).toLocaleString("ja-JP")}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-500">
                      ¥{Math.round(lim / 12).toLocaleString("ja-JP")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 行をクリックすると上のシミュレーターに反映されます
        </p>
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-orange-600"
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

      <RelatedTools currentToolId="furusato-nozei" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の控除上限額は所得・家族構成・各種控除の有無により異なります。
        正確な上限額はふるさと納税ポータルサイトの詳細シミュレーターや税理士にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
