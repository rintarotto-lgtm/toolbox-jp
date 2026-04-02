"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 一般税率
function calcGeneralTax(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 2_000_000) return amount * 0.1;
  if (amount <= 3_000_000) return amount * 0.15 - 100_000;
  if (amount <= 4_000_000) return amount * 0.2 - 250_000;
  if (amount <= 6_000_000) return amount * 0.3 - 650_000;
  if (amount <= 10_000_000) return amount * 0.4 - 1_250_000;
  if (amount <= 15_000_000) return amount * 0.45 - 1_750_000;
  if (amount <= 30_000_000) return amount * 0.5 - 2_500_000;
  return amount * 0.55 - 4_000_000;
}

// ─── 特例税率（直系尊属・受贈者18歳以上）
function calcSpecialTax(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 2_000_000) return amount * 0.1;
  if (amount <= 4_000_000) return amount * 0.15 - 100_000;
  if (amount <= 6_000_000) return amount * 0.2 - 300_000;
  if (amount <= 10_000_000) return amount * 0.3 - 900_000;
  if (amount <= 15_000_000) return amount * 0.4 - 1_900_000;
  if (amount <= 30_000_000) return amount * 0.45 - 2_650_000;
  if (amount <= 45_000_000) return amount * 0.5 - 4_150_000;
  return amount * 0.55 - 6_400_000;
}

const BASIC_DEDUCTION = 1_100_000;

function toMan(yen: number): string {
  if (yen === 0) return "0円";
  const man = Math.round(yen / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}
function toYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}
function fmtPct(pct: number): string {
  return `${pct.toFixed(2)}%`;
}

// 一般・特例税率の適用税率ラベル
function getRateLabel(amount: number, special: boolean): string {
  const brackets = special
    ? [
        { max: 2_000_000, rate: "10%" },
        { max: 4_000_000, rate: "15%" },
        { max: 6_000_000, rate: "20%" },
        { max: 10_000_000, rate: "30%" },
        { max: 15_000_000, rate: "40%" },
        { max: 30_000_000, rate: "45%" },
        { max: 45_000_000, rate: "50%" },
        { max: Infinity, rate: "55%" },
      ]
    : [
        { max: 2_000_000, rate: "10%" },
        { max: 3_000_000, rate: "15%" },
        { max: 4_000_000, rate: "20%" },
        { max: 6_000_000, rate: "30%" },
        { max: 10_000_000, rate: "40%" },
        { max: 15_000_000, rate: "45%" },
        { max: 30_000_000, rate: "50%" },
        { max: Infinity, rate: "55%" },
      ];
  if (amount <= 0) return "—";
  return brackets.find((b) => amount <= b.max)?.rate ?? "55%";
}

const FAQS = [
  {
    question: "贈与税の基礎控除110万円とは何ですか？",
    answer:
      "贈与税には年間110万円の基礎控除があります。1年間（1月1日〜12月31日）に受け取った贈与の合計額が110万円以下であれば、贈与税はかかりません。110万円を超えた部分に対して税率が適用されます。",
  },
  {
    question: "暦年贈与と相続時精算課税の違いは何ですか？",
    answer:
      "暦年贈与は毎年110万円の基礎控除を使って少額ずつ贈与する方法です。相続時精算課税は60歳以上の父母・祖父母から18歳以上の子・孫への贈与に適用でき、累計2,500万円まで贈与税が非課税になります。ただし相続時精算課税を選ぶと暦年贈与の110万円控除は使えなくなります。",
  },
  {
    question: "贈与税が非課税になるケースはありますか？",
    answer:
      "年間110万円以下の贈与のほか、住宅取得等資金の贈与（最大1,000万円）、教育資金の一括贈与（最大1,500万円）、結婚・子育て資金の一括贈与（最大1,000万円）などの特例があります。また夫婦間の居住用不動産贈与（最大2,000万円）も非課税となる場合があります。",
  },
  {
    question: "贈与税の申告期限はいつですか？",
    answer:
      "贈与税の申告期限は、贈与を受けた年の翌年2月1日から3月15日までです。110万円の基礎控除を超えた場合は申告が必要です。申告期限を過ぎると無申告加算税や延滞税が発生する場合がありますので注意が必要です。",
  },
];

// 年分割シミュレーション: 同じ総額を毎年110万円以下に分けた場合の総税額
function calcAnnualSplit(totalAmount: number, isSpecial: boolean): { years: number; totalTax: number } {
  const annualLimit = BASIC_DEDUCTION; // 非課税枠内なら0円
  const years = Math.ceil(totalAmount / annualLimit);
  // 毎年annualLimit贈与 → 課税0円 → 総税額0円
  return { years, totalTax: 0 };
}

// 贈与額別テーブル
const TABLE_AMOUNTS = [
  200_000_000, 300_000_000, 500_000_000, 1_000_000_000,
  2_000_000_000, 3_000_000_000, 5_000_000_000, 10_000_000_000,
].map((v) => v / 100); // 万→円変換: テーブルは万円単位で定義
const TABLE_AMOUNTS_YEN = [
  2_000_000, 3_000_000, 5_000_000, 10_000_000,
  20_000_000, 30_000_000, 50_000_000, 100_000_000,
];

export default function GiftTax() {
  const [giftAmount, setGiftAmount] = useState(5_000_000);
  const [isDirectAncestor, setIsDirectAncestor] = useState(true);
  const [isOver18, setIsOver18] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const useSpecial = isDirectAncestor && isOver18;
  const taxableAmount = Math.max(0, giftAmount - BASIC_DEDUCTION);
  const tax = useSpecial ? calcSpecialTax(taxableAmount) : calcGeneralTax(taxableAmount);
  const effectiveRate = giftAmount > 0 ? (tax / giftAmount) * 100 : 0;
  const rateLabel = getRateLabel(taxableAmount, useSpecial);

  // 比較: 一般税率と特例税率
  const generalTax = calcGeneralTax(taxableAmount);
  const specialTax = calcSpecialTax(taxableAmount);

  // 年分割シミュレーション
  const years = Math.ceil(giftAmount / BASIC_DEDUCTION);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        贈与税計算シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        贈与金額と贈与者の続柄を入力するだけで贈与税の目安額を計算します。一般税率・特例税率（直系尊属）に対応。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 贈与金額 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">贈与金額（年間合計）</label>
            <span className="text-xl font-extrabold text-violet-600">
              {toMan(giftAmount)}
            </span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={100_000}
            value={giftAmount}
            onChange={(e) => setGiftAmount(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-violet-200 to-violet-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100万</span>
            <span>1,000万</span>
            <span>2,500万</span>
            <span>5,000万</span>
            <span>1億</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: "200万", v: 2_000_000 },
              { label: "300万", v: 3_000_000 },
              { label: "500万", v: 5_000_000 },
              { label: "1,000万", v: 10_000_000 },
              { label: "3,000万", v: 30_000_000 },
              { label: "5,000万", v: 50_000_000 },
            ].map(({ label, v }) => (
              <button
                key={v}
                onClick={() => setGiftAmount(v)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  giftAmount === v
                    ? "bg-violet-500 text-white border-violet-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-violet-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 贈与者の続柄 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            贈与者の続柄
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDirectAncestor(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                isDirectAncestor
                  ? "bg-violet-500 text-white border-violet-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-violet-50"
              }`}
            >
              直系尊属（親・祖父母）
            </button>
            <button
              onClick={() => setIsDirectAncestor(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                !isDirectAncestor
                  ? "bg-violet-500 text-white border-violet-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-violet-50"
              }`}
            >
              その他
            </button>
          </div>
          {isDirectAncestor && (
            <p className="text-xs text-violet-600 mt-1">
              直系尊属からの贈与は特例税率が適用されます（受贈者18歳以上の場合）
            </p>
          )}
        </div>

        {/* 受贈者の年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            受贈者（もらう人）の年齢
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setIsOver18(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                isOver18
                  ? "bg-violet-500 text-white border-violet-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-violet-50"
              }`}
            >
              18歳以上
            </button>
            <button
              onClick={() => setIsOver18(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                !isOver18
                  ? "bg-violet-500 text-white border-violet-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-violet-50"
              }`}
            >
              18歳未満
            </button>
          </div>
          {!isOver18 && isDirectAncestor && (
            <p className="text-xs text-amber-600 mt-1">
              受贈者が18歳未満の場合、直系尊属からの贈与でも一般税率が適用されます
            </p>
          )}
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-violet-500 to-purple-600">
        <p className="text-sm font-medium opacity-90 mb-1">
          贈与税額（{useSpecial ? "特例税率" : "一般税率"}）
        </p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {taxableAmount === 0 ? "0円（非課税）" : toYen(tax)}
        </p>
        {taxableAmount > 0 && (
          <p className="text-sm opacity-80 mb-1">
            実効税率：{fmtPct(effectiveRate)}（贈与額に対する割合）
          </p>
        )}
        <div className="pt-4 border-t border-white/30 mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-75">課税対象額</p>
            <p className="text-2xl font-bold">{toMan(taxableAmount)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">適用税率</p>
            <p className="text-2xl font-bold">{rateLabel}</p>
          </div>
        </div>
      </div>

      {/* ─── 内訳カード ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">計算の内訳</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "贈与金額", value: toMan(giftAmount) },
            { label: "基礎控除", value: `− ${toMan(BASIC_DEDUCTION)}` },
            { label: "課税対象額", value: toMan(taxableAmount), highlight: true },
            { label: "適用税率", value: rateLabel },
            { label: "贈与税額", value: toYen(tax), highlight: true },
            { label: "実効税率（贈与額全体に対して）", value: fmtPct(effectiveRate) },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                highlight ? "font-bold text-violet-700" : "text-gray-700"
              }`}
            >
              <span>{label}</span>
              <span className={highlight ? "text-lg" : ""}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 一般税率 vs 特例税率 比較 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">一般税率 vs 特例税率 比較</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl p-4 border-2 ${!useSpecial ? "border-violet-400 bg-violet-50" : "border-gray-200 bg-gray-50"}`}>
            <p className="text-xs font-semibold text-gray-500 mb-1">一般税率</p>
            <p className="text-sm text-gray-500 mb-2">兄弟・他人等からの贈与</p>
            <p className="text-2xl font-extrabold text-gray-800">{toYen(generalTax)}</p>
            <p className="text-xs text-gray-400 mt-1">実効税率 {fmtPct(giftAmount > 0 ? (generalTax / giftAmount) * 100 : 0)}</p>
            {!useSpecial && <span className="inline-block mt-2 text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full">適用中</span>}
          </div>
          <div className={`rounded-xl p-4 border-2 ${useSpecial ? "border-violet-400 bg-violet-50" : "border-gray-200 bg-gray-50"}`}>
            <p className="text-xs font-semibold text-gray-500 mb-1">特例税率</p>
            <p className="text-sm text-gray-500 mb-2">直系尊属・18歳以上</p>
            <p className="text-2xl font-extrabold text-gray-800">{toYen(specialTax)}</p>
            <p className="text-xs text-gray-400 mt-1">実効税率 {fmtPct(giftAmount > 0 ? (specialTax / giftAmount) * 100 : 0)}</p>
            {useSpecial && <span className="inline-block mt-2 text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full">適用中</span>}
          </div>
        </div>
        {generalTax !== specialTax && (
          <p className="text-sm text-center mt-3 text-violet-700 font-medium">
            特例税率だと{toYen(Math.abs(generalTax - specialTax))}お得
          </p>
        )}
      </div>

      {/* ─── 年分割シミュレーション ─── */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          110万円ずつ毎年贈与した場合の節税シミュレーション
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {toMan(giftAmount)}を年間110万円（非課税枠内）に分割して贈与すると…
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">必要年数</p>
            <p className="text-2xl font-extrabold text-violet-700">{years}年</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">年分割時の総税額</p>
            <p className="text-2xl font-extrabold text-emerald-600">0円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">節税効果</p>
            <p className="text-2xl font-extrabold text-violet-700">{toYen(tax)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 毎年の贈与額が110万円以下の場合、贈与税はかかりません。ただし定期贈与と認定されると一括で課税される場合があります。
        </p>
      </div>

      <AdBanner />

      {/* ─── 贈与額別税額テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">贈与額別 税額一覧</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-right">
                <th className="text-left py-2 px-2 font-medium">贈与額</th>
                <th className="py-2 px-2 font-medium">課税対象</th>
                <th className="py-2 px-2 font-medium">一般税率</th>
                <th className="py-2 px-2 font-medium">特例税率</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_AMOUNTS_YEN.map((amount) => {
                const taxable = Math.max(0, amount - BASIC_DEDUCTION);
                const genTax = calcGeneralTax(taxable);
                const speTax = calcSpecialTax(taxable);
                const isCurrent = amount === giftAmount;
                return (
                  <tr
                    key={amount}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      isCurrent ? "bg-violet-50 font-bold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2.5 px-2 text-gray-800">{toMan(amount)}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">{toMan(taxable)}</td>
                    <td className="py-2.5 px-2 text-right text-gray-700">{toYen(genTax)}</td>
                    <td className="py-2.5 px-2 text-right text-violet-700">{toYen(speTax)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-violet-600"
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

      <RelatedTools currentToolId="gift-tax" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の贈与税額は配偶者控除・住宅取得等資金の特例・相続時精算課税制度など各種特例の適用によって異なります。
        贈与税の申告・納付については税理士または税務署にご相談ください。
        このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
